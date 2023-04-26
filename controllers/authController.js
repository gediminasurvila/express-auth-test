const jwt = require("jsonwebtoken");
const User = require("../models/User");
const utils = require("../utils");

const authController = {
  async register(req, res) {
    const { name, email } = req.body;
    try {
      await User.create({
        name,
        email,
      });
    } catch (err) {
      res.sendStatus(500);
    }
    res.sendStatus(201);
  },
  async getPasscode(req, res) {
    const { email } = req.body;
    if (!email) return res.sendStatus(401);

    const foundUser = await User.findOne({ email: email }).exec();
    if (!foundUser) return res.sendStatus(401);

    const passcode = utils.generatePasscode();
    const hashedPasscode = utils.hashPasscode(passcode);

    await User.findByIdAndUpdate(foundUser.id, {
      $set: {
        passcode: hashedPasscode,
        passcodeExpiration: new Date(Date.now() + 1 * 60 * 1000),
      },
    });

    // Send Email
    // utils.sendMail(foundUser.email, passcode);
    console.log("passcode", passcode);

    res.sendStatus(204);
  },
  async login(req, res) {
    const { email, passcode } = req.body;
    if (!email || !passcode) return res.sendStatus(401);

    const foundUser = await User.findOne({ email: email }).exec();
    if (!foundUser) return res.sendStatus(401);

    if (foundUser.passcodeExpiration < Date.now()) {
      return res.sendStatus(401);
    }

    if(!utils.verifyPasscode(passcode, foundUser.passcode)) {
      return res.sendStatus(401);
    }

    const sub = foundUser.id;
    const iss = process.env.APP_DOMAIN;

    const accessToken = jwt.sign(
      {
        iss: iss,
        email: email,
        sub: sub,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    const refreshToken = jwt.sign(
      {
        iss: iss,
        email: email,
        sub: sub,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await User.findByIdAndUpdate(foundUser.id, {
      $set: { refreshToken: refreshToken },
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    }); // Remove sameSite on prod
    res.send({ accessToken });
  },
  async logout(req, res) {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();

    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      }); // Remove sameSite on prod
      res.sendStatus(204);
    }

    await User.findByIdAndUpdate(foundUser.id, { $set: { refreshToken: "" } });
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" }); // Remove sameSite on prod
    res.sendStatus(204);
  },
};

module.exports = authController;

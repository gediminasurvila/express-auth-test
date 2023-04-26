const jwt = require("jsonwebtoken");
const User = require("../models/User");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if(!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;
  res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None' }); // Remove sameSite on prod
  
  const foundUser = await User.findOne({ refreshToken: refreshToken}).exec();

  if(!foundUser) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if(err || foundUser.id !== decoded.sub) return res.sendStatus(403);
    const accessToken = jwt.sign({
      iss: process.env.APP_DOMAIN,
      email: foundUser.email,
      sub: foundUser.id,
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s'});

    res.status(200).json({ accessToken });
  })
}

module.exports = { handleRefreshToken };
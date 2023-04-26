const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const refreshTokenController = require("../controllers/refreshTolenController");

router.post("/register", authController.register);
router.post("/passcode", authController.getPasscode);
router.post("/login", authController.login);
router.get("/refresh", refreshTokenController.handleRefreshToken);
router.get("/logout", authController.logout);

module.exports = router;

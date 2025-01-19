const express = require("express");
const {
  handleRegisterUser,
  handleLoginUser,
  handleForgotPassword,
  handleResetPassword,
} = require("../controllers/user");
const router = express.Router();

router.post("/register", handleRegisterUser);
router.post("/login", handleLoginUser);
router.post("/forgot-password", handleForgotPassword);
router.post("/reset-password", handleResetPassword);

module.exports = router;

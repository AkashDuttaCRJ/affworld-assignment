import { Router } from "express";
const router = Router();

import {
  handleForgotPassword,
  handleGoogleOAuth,
  handleLoginUser,
  handleRegisterUser,
  handleResetPassword,
} from "../controllers/auth";
import { User } from "../models/user";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

router.post("/register", handleRegisterUser);
router.post("/login", handleLoginUser);
router.post("/forgot-password", handleForgotPassword);
router.post("/reset-password", handleResetPassword);
router.get("/google", (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
  console.log(`Redirecting to ${url}`);
  res.redirect(url);
});
router.get("/google/callback", handleGoogleOAuth);
router.get("/logout", (req, res) => {
  res.clearCookie("x-access-token").redirect(process.env.APP_URL!);
});

export default router;

import axios from "axios";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

const handleRegisterUser: RequestHandler = async (req, res) => {};

const handleLoginUser: RequestHandler = async (req, res) => {};

const handleForgotPassword: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ success: false, message: "Email is required" });
      return;
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });

    // Send email with token

    res.status(200).json({
      success: true,
      message: "Password reset link has been sent to your email",
    });
    return;
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
};

const handleResetPassword: RequestHandler = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res
        .status(400)
        .json({ success: false, message: "Token and password are required" });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload;

    if (!decoded) {
      res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
      return;
    }

    const user = await User.findOne({
      email: decoded.email,
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    await User.updateOne(
      { email: decoded.email },
      {
        password: password,
      }
    );

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
    return;
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
};

const handleGoogleOAuth: RequestHandler = async (req, res) => {
  const { code } = req.query;
  console.log(`Code: ${code}`);
  try {
    // Exchange authorization code for access token
    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const { access_token, id_token } = data;

    console.log("Access Token: ", access_token);
    console.log("ID Token: ", id_token);

    // Use access_token or id_token to fetch user profile
    const { data: profile } = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    console.log("Profile: ", JSON.stringify(profile, null, 2));

    // check if user already exists
    const user = await User.findOne({ email: profile.email });
    if (!user) {
      const newUser = new User({
        name: { first: profile.given_name, last: profile.family_name },
        email: profile.email,
        password: "",
        profile: profile.picture,
        username: profile.email.split("@")[0],
        googleProfileData: profile,
        provider: "google",
      });
      await newUser.save();
    } else if (user.provider !== "google") {
      user.googleProfileData = profile;
      user.provider = "both";
      await user.save();
    }

    const token = jwt.sign({ email: profile.email }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res
      .cookie("x-access-token", token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 86400000), // 1 day
      })
      .redirect(`${process.env.APP_URL!}/app`);
  } catch (error) {
    console.error("Error:", error);
    res.redirect(process.env.APP_URL!);
  }
};

export {
  handleForgotPassword,
  handleGoogleOAuth,
  handleLoginUser,
  handleRegisterUser,
  handleResetPassword,
};

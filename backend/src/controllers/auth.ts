import axios from "axios";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import { seedDefaultColumns } from "../lib/seed-default-columns";
import { User } from "../models/user";
import { getResetPasswordEmailTemplate } from "../template";

const resend = new Resend(process.env.RESEND_API_KEY!);

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

const getUsernameAvailability: RequestHandler = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      res.status(400).json({ success: false, message: "Username is required" });
      return;
    }

    const existingUser = await User.findOne({
      username,
    })
      .select("username")
      .exec();

    if (existingUser) {
      res
        .status(200)
        .json({ success: false, message: "Username already exists" });
      return;
    }

    res.status(200).json({ success: true, message: "Username available" });
    return;
  } catch (error) {
    console.error("Get username availability error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
};

const handleRegisterUser: RequestHandler = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    if (!firstName || !lastName || !username || !email || !password) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
      return;
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      res.status(400).json({ success: false, message: "User already exists" });
      return;
    }

    const user = await User.create({
      name: {
        first: firstName,
        last: lastName,
      },
      username,
      email,
      password, // this is safe because we hash the password in the model just before saving
    });

    seedDefaultColumns(user._id);

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res
      .status(201)
      .json({ success: true, message: "User created", data: user, token });

    return;
  } catch (error) {
    console.error("Register user error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
};

const handleLoginUser: RequestHandler = async (req, res) => {
  try {
    const { email, password, remember } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
      return;
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (!(await user.comparePassword(password))) {
      res.status(401).json({ success: false, message: "Invalid password" });
      return;
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: remember ? "7d" : "1d",
    });

    res
      .status(200)
      .json({ success: true, message: "User logged in", data: user, token });
    return;
  } catch (error) {
    console.error("Login user error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
};

const handleForgotPassword: RequestHandler = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      res.status(400).json({
        success: false,
        message: "Either email or username is required",
      });
      return;
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (user.provider === "google") {
      res.status(400).json({
        success: false,
        message: "You cannot reset your password for a Google account",
      });
      return;
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });

    // Send email with token
    const url = `${process.env.APP_URL}/reset-password?token=${token}`;

    const template = getResetPasswordEmailTemplate(url);

    const { data, error } = await resend.emails.send({
      from: "YourCompany <onboarding@resend.dev>",
      to: user.email,
      subject: "Reset Your Password",
      html: template,
    });

    if (error) {
      console.error("Error sending email:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
      return;
    }

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

    user.password = password;
    await user.save();

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
      const newUser = await User.create({
        name: { first: profile.given_name, last: profile.family_name },
        email: profile.email,
        password: "",
        profile: profile.picture,
        username: profile.email.split("@")[0],
        googleProfileData: profile,
        provider: "google",
      });

      seedDefaultColumns(newUser._id);
    } else if (user.provider !== "google") {
      user.googleProfileData = profile;
      user.provider = "both";
      await user.save();
    }

    const token = jwt.sign({ email: profile.email }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.redirect(`${process.env.APP_URL!}/auth/google?token=${token}`);
  } catch (error) {
    console.error("Error:", error);
    res.redirect(process.env.APP_URL!);
  }
};

export {
  getUsernameAvailability,
  handleForgotPassword,
  handleGoogleOAuth,
  handleLoginUser,
  handleRegisterUser,
  handleResetPassword,
};

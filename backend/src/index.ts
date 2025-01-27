import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import { connectMongoDB } from "./config";

import { getUsernameAvailability } from "./controllers/auth";
import { middleware } from "./middleware";
import { User } from "./models/user";
import authRouter from "./routes/auth";
import postRouter from "./routes/post";
import taskRouter from "./routes/task";

const app = express();
app.use(
  cors({
    origin: process.env.APP_URL!,
    credentials: true,
  })
);
app.use(express.json());

app.use(cookieParser());

connectMongoDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/verify-token", (req, res) => {
  const token = req.cookies["x-access-token"];

  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;

  if (!decoded) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  res.status(200).json({ success: true, message: "Token is valid" });
  return;
});

app.get("/username-availablity", getUsernameAvailability);

app.use("/auth", authRouter);

app.use(middleware);
app.use("/tasks", taskRouter);
app.use("/post", postRouter);
app.get("/user", async (req, res) => {
  const token = req.cookies["x-access-token"];

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;

  if (!decoded) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const user = await User.findOne({ email: decoded.email });
  console.log({ user, decoded, token });
  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }
  res.status(200).json({
    success: true,
    data: {
      name: user.name,
      username: user.username,
      email: user.email,
      profile: user.profile,
    },
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { connectMongoDB } from "./config";

import { middleware } from "./middleware";
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

app.use("/auth", authRouter);

app.use(middleware);
app.use("/tasks", taskRouter);
app.use("/post", postRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

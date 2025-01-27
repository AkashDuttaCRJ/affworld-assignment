import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const middleware: RequestHandler = (req, res, next) => {
  console.log("Middleware called");
  const token = req.headers["x-access-token"] as string;
  console.log(`Token: ${token}`);
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
  console.log(`Decoded: ${JSON.stringify(decoded, null, 2)}`);
  if (!decoded) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }
  req.headers["email"] = decoded.email;
  next();
};

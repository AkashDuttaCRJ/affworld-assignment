import { connect } from "mongoose";

export const connectMongoDB = async () => {
  try {
    await connect(process.env.MONGODB_URI as string);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

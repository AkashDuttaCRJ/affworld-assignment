import { Types } from "mongoose";
import { Column } from "../models/column";

export const seedDefaultColumns = async (userId: Types.ObjectId) => {
  try {
    await Column.insertMany([
      { name: "Pending", _user: userId, tasks: [] },
      { name: "Completed", _user: userId, tasks: [] },
      { name: "Done", _user: userId, tasks: [] },
    ]);
  } catch (error) {
    console.error("Error seeding default columns:", error);
    throw error;
  }
};

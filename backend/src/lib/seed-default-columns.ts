import { Types } from "mongoose";
import { Column } from "../models/column";

export const seedDefaultColumns = async (userId: Types.ObjectId) => {
  try {
    await Column.insertMany([
      { name: "Pending", _user: userId, tasks: [], rank: 1 },
      { name: "Completed", _user: userId, tasks: [], rank: 2 },
      { name: "Done", _user: userId, tasks: [], rank: 3 },
    ]);
  } catch (error) {
    console.error("Error seeding default columns:", error);
    throw error;
  }
};

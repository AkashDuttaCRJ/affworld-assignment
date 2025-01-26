import { model, Schema } from "mongoose";

const ColumnSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  _user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tasks: {
    type: [Schema.Types.ObjectId],
    ref: "Task",
    required: true,
  },
  rank: {
    type: Number,
    required: true,
  },
});

ColumnSchema.set("timestamps", true);

export const Column = model("Column", ColumnSchema);

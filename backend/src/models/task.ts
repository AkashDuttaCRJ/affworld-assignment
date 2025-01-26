import { Schema, model } from "mongoose";

const TaskSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  columnId: {
    type: Schema.Types.ObjectId,
    ref: "Column",
    required: true,
  },
});

TaskSchema.set("timestamps", true);

export const Task = model("Task", TaskSchema);

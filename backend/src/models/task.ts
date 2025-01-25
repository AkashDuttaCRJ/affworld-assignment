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
    required: true,
  },
});

TaskSchema.set("timestamps", true);

const ColumnSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  _boardId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  tasks: {
    type: [Schema.Types.ObjectId],
    required: true,
  },
});

ColumnSchema.set("timestamps", true);

const BoardSchema = new Schema({
  columns: {
    type: [Schema.Types.ObjectId],
    required: true,
  },
  _userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

BoardSchema.set("timestamps", true);

export const Task = model("Task", TaskSchema);
export const Column = model("Column", ColumnSchema);
export const Board = model("Board", BoardSchema);

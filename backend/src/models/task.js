const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

TaskSchema.set("timestamps", true);

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;

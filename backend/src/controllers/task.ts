import { RequestHandler } from "express";
import { Column } from "../models/column";
import { Task } from "../models/task";
import { User } from "../models/user";

const handleCreateTask: RequestHandler = async (req, res) => {
  try {
    const email = req.headers["email"] as string;
    const { name, description, columnId } = req.body;

    if (!name || !description || !columnId) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
      return;
    }

    const user = await User.findOne({ email }).select("_id").exec();

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const column = await Column.findOne({ _id: columnId }).exec();

    if (!column) {
      res.status(404).json({ success: false, message: "Column not found" });
      return;
    }

    const task = await Task.create({
      name,
      description,
      columnId,
    });

    column.tasks.push(task._id);
    await column.save();

    res
      .status(201)
      .json({ success: true, message: "Task created", data: task });
    return;
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
};

const handleUpdateTask: RequestHandler = async (req, res) => {
  try {
    const email = req.headers["email"] as string;
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ success: false, message: "Task ID is required" });
      return;
    }

    const { name, description, columnId, tasksOrder } = req.body;

    if (!name && !description && !columnId && !tasksOrder) {
      res.status(400).json({
        success: false,
        message:
          "At least one field (name, description, or columnId with tasksOrder) is required.",
      });
      return;
    }

    if ((columnId && !tasksOrder) || (!columnId && tasksOrder)) {
      res.status(400).json({
        success: false,
        message: "Both columnId and tasksOrder must be provided together.",
      });
      return;
    }

    const user = await User.findOne({ email }).select("_id").exec();

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const task = await Task.findOne({ _id: id }).exec();

    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    if (name) {
      task.name = name;
    }

    if (description) {
      task.description = description;
    }

    if (columnId) {
      const oldColumn = await Column.findOne({ _id: task.columnId }).exec();
      const newColumn = await Column.findOne({ _id: columnId }).exec();

      if (!oldColumn || !newColumn) {
        res.status(404).json({ success: false, message: "Column not found" });
        return;
      }

      oldColumn.tasks = oldColumn.tasks.filter((taskId) => taskId !== task._id);
      newColumn.tasks = [...tasksOrder];

      task.columnId = columnId;

      await oldColumn.save();
      await newColumn.save();
    }

    await task.save();

    res.json({ success: true, message: "Task updated", data: task });
    return;
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
};

const handleDeleteTask: RequestHandler = async (req, res) => {
  try {
    const email = req.headers["email"] as string;
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ success: false, message: "Task ID is required" });
      return;
    }

    const user = await User.findOne({ email }).select("_id").exec();

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const task = await Task.findOne({ _id: id }).exec();

    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    await Task.deleteOne({ _id: id }).exec();

    const column = await Column.findOne({ _id: task.columnId }).exec();

    if (!column) {
      res.status(404).json({ success: false, message: "Column not found" });
      return;
    }

    column.tasks = column.tasks.filter((taskId) => taskId !== task._id);
    await column.save();

    res.json({ success: true, message: "Task deleted" });
    return;
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
};

const handleGetTasks: RequestHandler = async (req, res) => {
  try {
    const email = req.headers["email"] as string;

    const user = await User.findOne({ email }).select("_id").exec();

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const columns = await Column.find({ _user: user._id })
      .populate("tasks")
      .exec();

    res.json({ success: true, data: columns });
    return;
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
};

export { handleCreateTask, handleDeleteTask, handleGetTasks, handleUpdateTask };

import { RequestHandler } from "express";

const handleCreateTask: RequestHandler = async (req, res) => {};

const handleGetTasks: RequestHandler = async (req, res) => {
  const email = req.headers["email"] as string;
  res.json({ success: true, message: "Task Created!" });
};

const handleUpdateTask: RequestHandler = async (req, res) => {};

const handleDeleteTask: RequestHandler = async (req, res) => {};

export { handleCreateTask, handleDeleteTask, handleGetTasks, handleUpdateTask };

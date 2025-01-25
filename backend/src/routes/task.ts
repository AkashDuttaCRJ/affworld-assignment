import { Router } from "express";
const router = Router();

import {
  handleCreateTask,
  handleDeleteTask,
  handleGetTasks,
  handleUpdateTask,
} from "../controllers/task";

router
  .route("/")
  .get(handleGetTasks)
  .post(handleCreateTask)
  .patch(handleUpdateTask)
  .delete(handleDeleteTask);

export default router;

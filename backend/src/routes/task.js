const express = require("express");
const {
  handleGetTasks,
  handleCreateTask,
  handleUpdateTask,
  handleDeleteTask,
} = require("../controllers/task");
const router = express.Router();

router
  .route("/")
  .get(handleGetTasks)
  .post(handleCreateTask)
  .patch(handleUpdateTask)
  .delete(handleDeleteTask);

module.exports = router;

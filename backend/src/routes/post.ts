import { Router } from "express";
import {
  handleCreatePost,
  handleDeletePost,
  handleGetAllPosts,
  handleGetPost,
  handleUpdatePost,
} from "../controllers/post";
const router = Router();

router.route("/").get(handleGetAllPosts).post(handleCreatePost);

router
  .route("/:id")
  .get(handleGetPost)
  .patch(handleUpdatePost)
  .delete(handleDeletePost);

export default router;

import { RequestHandler } from "express";
import { Post } from "../models/post";
import { User } from "../models/user";

const handleCreatePost: RequestHandler = async (req, res) => {
  try {
    const email = req.headers["email"] as string;
    const { imageUrls, caption } = req.body;

    if ((!imageUrls || !imageUrls.length) && !caption) {
      res
        .status(400)
        .json({ success: false, message: "Image URLs or caption is required" });
      return;
    }

    const user = await User.findOne({ email }).select("_id").exec();
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const post = await Post.create({
      imageUrls,
      caption,
      _user: user._id,
    });

    res
      .status(201)
      .json({ success: true, message: "Post created", data: post });
    return;
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
};

const handleGetAllPosts: RequestHandler = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("_user")
      .sort({ createdAt: -1 })
      .exec();

    res.json({
      success: true,
      data: posts,
    });
    return;
  } catch (error) {
    console.error("Get all posts error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
};

const handleGetPost: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ success: false, message: "Post ID is required" });
      return;
    }
    const post = await Post.findOne({
      _id: id,
    })
      .populate("_user")
      .exec();
    if (!post) {
      res.status(404).json({ success: false, message: "Post not found" });
      return;
    }
    res.json({ success: true, data: post });
    return;
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
};

const handleUpdatePost: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrls, caption } = req.body;
    if (!id) {
      res.status(400).json({ success: false, message: "Post ID is required" });
      return;
    }
    if ((!imageUrls || !imageUrls.length) && !caption) {
      res
        .status(400)
        .json({ success: false, message: "Image URL or caption is required" });
      return;
    }
    const post = await Post.findOne({ _id: id }).exec();
    if (!post) {
      res.status(404).json({ success: false, message: "Post not found" });
      return;
    }
    if (imageUrls) {
      post.imageUrls = imageUrls;
    }
    if (caption) {
      post.caption = caption;
    }
    await post.save();
    res.json({ success: true, message: "Post updated", data: post });
    return;
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
};

const handleDeletePost: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ success: false, message: "Post ID is required" });
      return;
    }
    const post = await Post.deleteOne({ _id: id }).exec();
    console.log("Post:", post);
    res.json({ success: true, message: "Post deleted" });
    return;
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
};

export {
  handleCreatePost,
  handleDeletePost,
  handleGetAllPosts,
  handleGetPost,
  handleUpdatePost,
};

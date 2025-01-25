import { model, Schema } from "mongoose";

const PostSchema = new Schema({
  imageUrls: {
    type: [String],
    default: null,
  },
  caption: {
    type: String,
    default: null,
  },
  _userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

PostSchema.set("toJSON", { virtuals: true });
PostSchema.set("toObject", { virtuals: true });
PostSchema.set("timestamps", true);

export const Post = model("Post", PostSchema);

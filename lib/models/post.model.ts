import mongoose from "mongoose";
import { optional } from "zod";

const postSchema = new mongoose.Schema({
  // image: { type: Array, default: [] },
  image: { type: String },
  text: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  headParent: String,
  parentId: String,
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
    },
  ],
  community: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
  liked: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Posts = mongoose.models.Posts || mongoose.model("Posts", postSchema);

export default Posts;

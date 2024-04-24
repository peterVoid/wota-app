"use server";
import { revalidatePath } from "next/cache";
import { connectDB } from "../connectDB";
import Posts from "../models/post.model";
import User from "../models/user.model";

interface Props {
  images: string | null;
  text: string;
  currentId: string;
  path?: string;
}

export const createdThread = async ({
  images,
  text,
  currentId,
  path,
}: Props) => {
  try {
    connectDB();

    const post = await Posts.create({
      image: images,
      text,
      author: currentId,
    });

    await User.findByIdAndUpdate(currentId, {
      $push: { posts: post._id },
    });

    revalidatePath(path!);
  } catch (error: any) {
    throw new Error(`Failed to create post ${error.message}`);
  }
};

export const fetchPosts = async (pageNumber = 1, pageSize = 30) => {
  try {
    connectDB();

    const pageAmount = (pageNumber - 1) * pageSize;

    const queryPost = Posts.find({
      parentId: { $in: [undefined, null] },
    })
      .populate({ path: "author", model: User, select: "id image username" })
      .populate({
        path: "children",
        model: Posts,
        populate: {
          path: "author",
          model: User,
          select: "image username id",
        },
      })
      .limit(pageSize)
      .skip(pageAmount)
      .sort({ createdAt: "desc" });

    const totalDoc = await Posts.countDocuments();

    const post = await queryPost.exec();

    const isNext = totalDoc > pageAmount + pageSize;

    return { post, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch general posts ${error.message}`);
  }
};

export const fetchPostById = async (idThread: string) => {
  connectDB();
  try {
    const posts = await Posts.findById(idThread)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image username",
      })
      .populate({
        path: "children",
        model: Posts,
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id parentId username  image",
          },
          {
            path: "children",
            model: Posts,
            populate: {
              path: "author",
              model: User,
              select: "_id id username image  parentId",
            },
          },
        ],
      })
      .exec();

    return posts;
  } catch (error: any) {
    throw new Error(`Failed to get thread ${error.message}`);
  }
};

export const addComment = async (
  headPost: string,
  currentUserId: string,
  text: string,
  path: string
) => {
  try {
    connectDB();

    const parentPost = await Posts.findById(headPost);

    const queryComment = new Posts({
      text,
      image: null,
      author: currentUserId,
      parentId: headPost,
    });

    const Comment = await queryComment.save();

    parentPost.children.push(Comment._id);

    await parentPost.save();

    revalidatePath(path);
  } catch (error: any) {
    console.log("Error", error);
    throw new Error(`Failed to add comment ${error.message}`);
  }
};

export const likePost = async (userId: string, threadId: string) => {
  try {
    connectDB();
    let parentPost = await Posts.findById(threadId);
    if (parentPost.liked.includes(userId)) {
      parentPost.liked = parentPost.liked.filter((id: string) => {
        return id.toString() !== userId.toString();
      });
    } else {
      parentPost.liked.push(userId);
    }
    await parentPost.save();

    let userPost = await User.findById(userId);
    if (userPost.likes.includes(threadId)) {
      userPost.likes = userPost.likes.filter((id: string) => {
        return id.toString() !== threadId;
      });
    } else {
      userPost.likes.push(threadId);
    }

    await userPost.save();
  } catch (error: any) {
    console.log(error);
    throw new Error(`Failed to add like ${error.message}`);
  }
};

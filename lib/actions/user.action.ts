"use server";
import { revalidatePath } from "next/cache";
import { connectDB } from "../connectDB";
import User from "../models/user.model";
import { FilterQuery, SortOrder } from "mongoose";
import Posts from "../models/post.model";

interface Props {
  userId: string;
  username: string;
  name: string;
  bio: string;
  imageUrl: string;
  path?: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  imageUrl,
  path,
}: Props) {
  try {
    connectDB();
    await User.findOneAndUpdate(
      {
        id: userId,
      },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image: imageUrl,
        onBoarded: true,
      },
      {
        upsert: true,
      }
    );
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectDB();
    const user = await User.findOne({ id: userId });

    return user;
  } catch (error: any) {
    throw new Error(`Failed to get user ${error.message}`);
  }
}

export async function getUsers({
  userId,
  sortBy = "desc",
}: {
  userId: string;
  sortBy: SortOrder;
}) {
  connectDB();
  try {
    const query: FilterQuery<typeof User> = {
      id: { $en: userId },
    };
  } catch (error: any) {
    console.log("Error get users", error);
    throw new Error(`Error get users ${error.message}`);
  }
}

export async function fetchUsers({
  currentUserId,
  pageNumber = 1,
  pageSize = 30,
  searchString = "",
  sortBy = "desc",
}: {
  currentUserId: string;
  pageNumber?: number;
  pageSize?: number;
  searchString?: string;
  sortBy?: SortOrder;
}) {
  try {
    connectDB();
    // Calculate the number of users to skip based on the page number and page size
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string
    const regex = new RegExp(searchString, "i");

    // Create an inital object to filter users
    const query: FilterQuery<typeof User> = {
      id: { $ne: currentUserId }, //not the same as me
    };

    // If the search string is not empty add the $or operator to match either username or name fields
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const userQuery = User.find(query)
      .sort(sortOptions)
      .limit(pageSize)
      .skip(skipAmount);

    const totalUsersCount = await User.countDocuments();

    const users = await userQuery.exec();

    const isNext = totalUsersCount > users.length + skipAmount;

    return { users, isNext };
  } catch (error: any) {
    console.log(error);
    throw new Error(`Failed to get all users except me ${error.message}`);
  }
}

export async function fetchUserPosts(accountId: string) {
  try {
    connectDB();

    const user = await User.findOne({ id: accountId }).populate({
      path: "posts",
      model: Posts,
      populate: [
        {
          path: "author",
          model: User,
          select: "_id id image username",
        },
        {
          path: "children",
          model: Posts,
          populate: {
            path: "author",
            model: User,
            select: "username image id",
          },
        },
      ],
    });
    return user;
  } catch (error: any) {
    console.log(error);
    throw new Error(`Failed get thread from user: ${error.message}`);
  }
}

export async function getActivity(userId: string) {
  try {
    connectDB();
    const postUser = await Posts.find({ author: userId });

    const getComment = postUser.reduce((acc, post) => {
      return acc.concat(post.children);
    }, []);

    const activity = Posts.find({
      _id: { $in: getComment },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "username image _id",
    });

    return activity;
  } catch (error: any) {
    console.log(error);
    throw new Error(`Failed to get activity ${error.message}`);
  }
}

export async function fetchReplies(userId: string) {
  try {
    connectDB();
    const post = await Posts.find({
      author: userId,
      parentId: { $ne: "" || undefined || null },
    }).populate({
      path: "author",
      model: User,
      select: "image id username",
    });
    return post;
  } catch (error: any) {
    console.log(error);
    throw new Error(`failed to get replies: ${error.message}`);
  }
}

export async function fetchLike(userId: string) {
  try {
    connectDB();
    const user = await User.findOne({ id: userId });
    const b = await Posts.find({
      liked: { $in: [user._id] },
    }).populate({ path: "author", model: User, select: "image id username" });
    return b;
  } catch (error: any) {
    console.log(error);
    throw new Error(`Failed to get like ${error.message}`);
  }
}

export async function deletePost(
  threadId: string,
  currentUserId: string,
  pathname: string
) {
  try {
    connectDB();
    const post = await Posts.findByIdAndDelete(threadId);
    let usah = await User.findOne({ id: currentUserId });
    const existingPost = usah.posts.includes(threadId);
    const existingLike = usah.likes.includes(threadId);

    if (existingPost) {
      usah.posts = usah.posts.filter((id: string) => {
        return id.toString() !== threadId.toString();
      });
    }
    if (existingLike) {
      usah.likes = usah.likes.filter((id: string) => {
        return id.toString() !== threadId.toString();
      });
    }

    const parent = await Posts.find({ parentId: threadId.toString() });

    for (const a of parent) {
      const pare = await Posts.findById(a._id);
      const childen = pare.children;
      await Posts.findByIdAndDelete(a._id);
      await Posts.deleteMany({ _id: { $in: childen } });
      // for (const b of childen) {
      //   const pares = await Posts.findById(b._id);
      //   await Posts.findByIdAndDelete(b._id);
      // }
    }

    await usah.save();

    revalidatePath(pathname);
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
}

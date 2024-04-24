"use client";

import { Trash } from "lucide-react";

interface Props {
  threadId: string;
  targetUser: string;
  currentUserId: string;
}

const DeletePost = ({ threadId, targetUser, currentUserId }: Props) => {
  const handleDeletePost = () => {
    if (
      !window.confirm(
        "Do you really want to delete this post?😫 -> plzz do not do that😫😫😘😘"
      )
    )
      return;
    console.log(threadId, currentUserId);
  };
  return (
    <div
      className="absolute right-2 cursor-pointer hover:text-red-600"
      onClick={handleDeletePost}
    >
      <Trash />
    </div>
  );
};

export default DeletePost;

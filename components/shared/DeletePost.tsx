"use client";

import { deletePost } from "@/lib/actions/user.action";
import { Trash } from "lucide-react";
import { usePathname } from "next/navigation";

interface Props {
  threadId: string;
  targetUser: string;
  currentUserId: string;
}

const DeletePost = ({ threadId, targetUser, currentUserId }: Props) => {
  const pathname = usePathname();
  const handleDeletePost = async () => {
    if (
      !window.confirm(
        "Do you really want to delete this post?😫 -> plzz do not do that😫😫😘😘"
      )
    )
      return;
    await deletePost(threadId, currentUserId, pathname);
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

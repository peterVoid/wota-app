"use client";
import { likePost } from "@/lib/actions/post.action";
import { fetchUser } from "@/lib/actions/user.action";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";

interface Props {
  userId: string;
  threadId: string;
  currentUserId: string;
}

const LikePost = ({ userId, threadId, currentUserId }: Props) => {
  const [like, setLike] = useState(false);
  const handleLike = async () => {
    await likePost(userId, threadId);
    let usah = await fetchUser(currentUserId);
    if (usah?.likes.includes(threadId)) {
      setLike(true);
    } else {
      setLike(false);
    }
  };

  useEffect(() => {
    const checkLike = async () => {
      let usah = await fetchUser(currentUserId);
      if (usah?.likes.includes(threadId)) {
        setLike(true);
      } else {
        setLike(false);
      }
    };
    checkLike();
  }, [like, setLike, currentUserId]);
  return (
    <Heart
      width={24}
      height={24}
      onClick={handleLike}
      fill={like ? "red" : "gray"}
      className="cursor-pointer object-contain"
    />
  );
};

export default LikePost;

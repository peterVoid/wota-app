import { formatDateString } from "@/lib/utils";
import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DeletePost from "../shared/DeletePost";
import LikePost from "../shared/LikePost";

interface Props {
  currentUserId: string;
  images: string | null;
  threadId: string;
  text: string;
  author: {
    image: string;
    username: string;
    id: string;
  };
  parentId: string | null;
  children:
    | {
        author: {
          id: string;
          username: string;
          image: string;
        };
      }[]
    | null;
  createdAt: Date;
  isComment?: boolean;
  targetUser?: string;
  userId?: string;
}

const PostCard = ({
  currentUserId,
  threadId,
  author,
  children,
  createdAt,
  images,
  parentId,
  text,
  isComment,
  targetUser,
  userId,
}: Props) => {
  return (
    <article
      className={`flex flex-col rounded-xl bg-dark-2 p-7 relative overflow-hidden`}
    >
      {targetUser && targetUser === currentUserId && (
        <DeletePost
          threadId={threadId}
          targetUser={targetUser!}
          currentUserId={currentUserId}
        />
      )}

      <div className="flex justify-between gap-3">
        <div className="flex flex-col items-center">
          <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
            <Image
              src={author.image}
              alt="Profile Image"
              fill
              className="cursor-pointer rounded-lg"
            />
          </Link>

          <div className="thread-card_bar" />
        </div>

        <div className="flex w-full flex-col">
          {parentId && !isComment && (
            <Link href={`/post/${parentId}`} className="text-cyan-500 text-md">
              Go to status {`->`}
            </Link>
          )}
          <Link href={`/profile/${author.id}`} className="w-fit">
            <h4 className="cursor-pointer font-semibold text-md text-white">
              {author.username}
            </h4>
          </Link>

          {images ? (
            <>
              <div className="my-2">
                <Image
                  src={images}
                  alt="wokw"
                  width={90}
                  height={90}
                  className="object-cover"
                />
              </div>
            </>
          ) : null}

          <p className="mt-2 text-sm text-white">{text}</p>
          <div className="mt-5 flex flex-col gap-3">
            <div className="flex gap-3.5">
              <LikePost
                userId={userId!}
                threadId={threadId}
                currentUserId={currentUserId}
              />
              <Link href={`/post/${threadId}`}>
                <Image
                  src="/assets/reply.svg"
                  alt="Reply"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </Link>
              <Image
                src="/assets/repost.svg"
                alt="Repost"
                width={24}
                height={24}
                className="cursor-pointer object-contain"
              />
              <Image
                src="/assets/share.svg"
                alt="share"
                width={24}
                height={24}
                className="cursor-pointer object-contain"
              />
            </div>
          </div>

          <p className="text-subtle-medium text-gray-1">
            {formatDateString(createdAt)}
          </p>
          {/* SHOW COMMENT LOGO */}

          {isComment && children?.length! > 0 && (
            <p className="text-subtle-medium text-gray-1">
              {children?.length} Replies
            </p>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;

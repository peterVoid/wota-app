import { fetchUserPosts } from "@/lib/actions/user.action";
import PostCard from "../cards/PostCard";
import { currentUser } from "@clerk/nextjs";

interface Props {
  currentUserId: string;
  accountId: string;
}

const ThreadTab = async ({ currentUserId, accountId }: Props) => {
  const user = await currentUser();
  const result = await fetchUserPosts(accountId);
  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.posts.map((post: any) => (
        <PostCard
          key={post._id}
          threadId={post._id}
          currentUserId={user?.id!}
          images={post.image}
          text={post.text}
          author={post.author}
          parentId={post.parentId}
          comment={post.children}
          createdAt={post.createdAt}
          targetUser={accountId}
        />
      ))}
    </section>
  );
};

export default ThreadTab;

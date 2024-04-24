import { fetchLike, fetchUser } from "@/lib/actions/user.action";
import PostCard from "../cards/PostCard";
import { currentUser } from "@clerk/nextjs";

interface Props {
  currentUserId: string;
}

const ThreadLike = async ({ currentUserId }: Props) => {
  const user = await currentUser();
  const userData = await fetchUser(user?.id!);
  const a = await fetchLike(currentUserId);

  return (
    <section className="mt-9 flex flex-col gap-10">
      {a.map((post: any) => (
        <PostCard
          key={post._id}
          threadId={post._id}
          currentUserId={user?.id!}
          images={post.image}
          text={post.text}
          author={post.author}
          parentId={post.parentId}
          children={post.children}
          createdAt={post.createdAt}
          userId={userData?._id}
        />
      ))}
    </section>
  );
};

export default ThreadLike;

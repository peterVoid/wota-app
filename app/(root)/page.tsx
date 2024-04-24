import PostCard from "@/components/cards/PostCard";
import { fetchPosts } from "@/lib/actions/post.action";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();
  const userData = await fetchUser(user?.id!);
  const result = await fetchPosts(1, 30);

  if (!userData?.onBoarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result && result.post.length > 0 ? (
          <div className="flex flex-col gap-4 w-[600px] max-w-[900px]">
            {result.post.map((data) => (
              <PostCard
                key={data._id}
                threadId={data._id}
                currentUserId={user?.id!}
                images={data.image}
                text={data.text}
                author={data.author}
                parentId={data.parentId}
                comment={data.children}
                createdAt={data.createdAt}
                userId={userData?._id}
              />
            ))}
          </div>
        ) : (
          <p className="text-white font-semibold">
            Be the first person to create a status
            {" -> "}
            <Link href="/create-thread" className="text-cyan-500">
              Klik
            </Link>
          </p>
        )}
      </section>
    </>
  );
}

import PostCard from "@/components/cards/PostCard";
import Comment from "@/components/forms/Comment";
import { fetchPostById } from "@/lib/actions/post.action";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params) null;
  const user = await currentUser();
  if (!user) null;
  const userInfo = await fetchUser(user?.id!);
  if (!userInfo.onBoarded) redirect("/");

  const result = await fetchPostById(params.id);
  return (
    <section className="relative">
      <div>
        <PostCard
          key={result._id}
          threadId={result._id}
          currentUserId={user?.id!}
          images={result.image}
          text={result.text}
          author={result.author}
          parentId={result.parentId}
          comment={result.children}
          createdAt={result.createdAt}
        />

        <div className="mt-7">
          <Comment
            headPost={result._id}
            currentUserId={userInfo._id}
            imageUser={userInfo.image}
            path={`/post/${params.id}`}
          />
        </div>

        <div className="mt-10 flex flex-col gap-3">
          {result.children && result.children.length > 0 ? (
            <>
              {result.children.map((res: any) => (
                <PostCard
                  key={res._id}
                  threadId={res._id}
                  currentUserId={user?.id!}
                  images={res.image}
                  text={res.text}
                  author={res.author}
                  parentId={res.parentId}
                  comment={res.children}
                  createdAt={res.createdAt}
                  isComment
                  userId={userInfo._id}
                />
              ))}
            </>
          ) : (
            <p>No Comments</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Page;

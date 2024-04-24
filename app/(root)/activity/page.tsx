import { fetchUser, getActivity } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();
  if (!user) null;
  const userInfo = await fetchUser(user?.id!);
  if (!userInfo.onBoarded) redirect("/onboarding");

  const result = await getActivity(userInfo._id);
  console.log(result);

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {result.length > 0 ? (
          <>
            {result.map((res) => (
              <Link href={`/post/${res.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={res.author.image}
                    alt="Profile Pic"
                    width={20}
                    height={20}
                  />

                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {res.author.username}
                    </span>
                    replied to your post
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3">No Activity</p>
        )}
      </section>
    </section>
  );
};

export default Page;

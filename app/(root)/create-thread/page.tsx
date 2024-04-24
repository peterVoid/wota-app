import CreatePost from "@/components/forms/CreatePost";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();
  if (!user) null;

  const userData = await fetchUser(user?.id!);
  if (!userData?.onBoarded) redirect("/onboarding");
  return (
    <>
      <h1 className="head-text">Create Post</h1>
      <CreatePost currentUserId={userData?._id!} />
    </>
  );
};

export default Page;

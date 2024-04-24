import UserForm from "@/components/forms/userForm";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";

const Page = async () => {
  const user = await currentUser();
  const userInfo = await fetchUser(user?.id!);
  const userData = {
    id: user?.id,
    image: userInfo?.image || user?.imageUrl,
    username: userInfo?.username || user?.username,
    name: userInfo?.name || user?.firstName || "",
    bio: userInfo?.bio || "",
  };
  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now, to use Thread.
      </p>

      <div className="mt-5 max-w-5xl p-6 rounded-md bg-dark-2">
        <UserForm dataUser={userData} />
      </div>
    </main>
  );
};

export default Page;

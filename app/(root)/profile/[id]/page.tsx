import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadLike from "@/components/shared/ThreadLike";
import ThreadReplies from "@/components/shared/ThreadReplies";
import ThreadTab from "@/components/shared/ThreadTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constans";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) null;
  const user = await currentUser();
  if (!user) null;

  const userInfo = await fetchUser(params.id);
  if (!userInfo?.onBoarded) redirect("/onboarding");

  return (
    <section>
      <ProfileHeader
        imgUrl={userInfo.image}
        username={userInfo.username}
        name={userInfo.name}
        bio={userInfo.bio}
        accountId={userInfo.id}
        currentUserId={user?.id!}
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />

                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo?.posts?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="threads" className="w-full text-light-1">
            <ThreadTab currentUserId={user?.id!} accountId={userInfo.id} />
          </TabsContent>
          <TabsContent value="replies">
            <ThreadReplies currentUserId={user?.id!} accountId={userInfo._id} />
          </TabsContent>
          <TabsContent value="like">
            <ThreadLike currentUserId={user?.id!} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Page;

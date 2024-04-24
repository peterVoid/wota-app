import UserCard from "@/components/cards/UserCard";
import SearchBar from "@/components/shared/SearchBar";
import { fetchUser, fetchUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();
  if (!user) null;
  const userInfo = await fetchUser(user?.id!);
  if (!userInfo?.onBoarded) redirect("/onboarding");

  const result = await fetchUsers({
    currentUserId: user?.id!,
    pageNumber: 1,
    pageSize: 30,
    searchString: searchParams.q,
  });
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <SearchBar routeType="search" />

      <div className="mt-14 flex flex-col gap-9">
        {result.users.length === 0 ? (
          <p className="no-result">No Users</p>
        ) : (
          <>
            {result.users.map((user) => (
              <UserCard
                key={user.id}
                id={user.id}
                username={user.username}
                name={user.name}
                imgUrl={user.image}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Page;

"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface Props {
  imgUrl: string;
  username: string;
  name: string;
  bio: string;
  accountId: string;
  currentUserId: string;
}

const ProfileHeader = ({
  imgUrl,
  username,
  name,
  bio,
  accountId,
  currentUserId,
}: Props) => {
  const router = useRouter();
  const editProfile = accountId === currentUserId;
  return (
    <div className="w-full flex flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-16 w-20 object-cover">
            <Image
              src={imgUrl}
              alt="Profile image"
              fill
              className="rounded-full object-contain shadow-2xl"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {name}
              <p className="text-base-medium text-gray-1">@{username}</p>
            </h2>
          </div>
        </div>

        {editProfile && (
          <Button
            className="bg-primary-500"
            onClick={() => router.push("/onboarding")}
          >
            Edit Profile
          </Button>
        )}
      </div>

      {/* TODO: Community */}

      <p className="mt-3 max-w-lg text-base-regular text-light-2">{bio}</p>

      <div className="mt-10 h-0.5 w-full bg-dark-3" />
    </div>
  );
};

export default ProfileHeader;

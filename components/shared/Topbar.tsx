"use client";
import { OrganizationSwitcher, SignedIn, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { dark } from "@clerk/themes";
import { useRouter } from "next/navigation";

const Topbar = () => {
  const router = useRouter();
  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-4">
        <Image src={"/logo.svg"} alt="logo" width={30} height={30} />
        <h1 className="head-text text-left">Wota App</h1>
      </Link>

      <div className="flex items-center gap-1">
        <div className="">
          <SignedIn>
            <SignOutButton signOutCallback={() => router.push("/sign-in")}>
              <div className="flex cursor-pointer">
                <Image
                  src="/assets/logout.svg"
                  alt="logout"
                  width={24}
                  height={24}
                />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;

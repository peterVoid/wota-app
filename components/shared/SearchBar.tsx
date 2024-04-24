"use client";
import Image from "next/image";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  routeType: string;
}

const SearchBar = ({ routeType }: Props) => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // query after 0.3 of no input

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        router.push(`/${routeType}?q=` + search);
      } else {
        router.push(`/${routeType}`);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, routeType]);

  return (
    <div className="searchbar">
      <Image
        src="/assets/search-gray.svg"
        alt="Search"
        width={24}
        height={24}
        className="object-contain"
      />

      <Input
        id="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search user"
        className="no-focus searchbar_input"
      />
    </div>
  );
};

export default SearchBar;

import Link from "next/link";
import { motion } from "framer-motion";
import { UserCard } from "@/components/user/user-card";
import { Loading } from "@/components/ui/loading";
import { Error } from "@/components/ui/error";
import { variants } from "./aside-trends";
import { useTrending } from "@/query/trending";
import { useMemo } from "react";
import compact from "lodash.compact";

export function Suggestions(): JSX.Element {
  const { data, isLoading } = useTrending("character");

  const characters = useMemo(
    () => compact(data?.pages.flatMap((page) => page.items)).slice(0, 5),
    [data]
  );

  return (
    <section className="hover-animation rounded-2xl bg-main-sidebar-background">
      {isLoading ? (
        <Loading className="flex items-center justify-center p-4 h-52" />
      ) : data ? (
        <motion.div className="inner:px-4 inner:py-3" {...variants}>
          <h2 className="text-xl font-bold">Who to follow</h2>
          {characters.map((character) => (
            <UserCard {...character} key={character.id} />
          ))}
          <Link
            href="/explore"
            className="block w-full text-center rounded-t-none custom-button accent-tab hover-card rounded-2xl text-main-accent"
          >
            Explore more
          </Link>
        </motion.div>
      ) : (
        <Error />
      )}
    </section>
  );
}

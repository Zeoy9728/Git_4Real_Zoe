import { motion } from "framer-motion";
import { Loading } from "@/components/ui/loading";
import { UserNav } from "@/components/user/user-nav";
import { variants } from "@/components/user/user-header";
import type { LayoutProps } from "./common-layout";
import { useRouter } from "next/router";
import { useCharacterByHandle } from "@crossbell/indexer";

export function UserFollowLayout({ children }: LayoutProps): JSX.Element {
  const {
    query: { id },
  } = useRouter();

  const { data: character, isLoading } = useCharacterByHandle(id as string);

  return (
    <>
      {!character ? (
        <motion.section {...variants}>
          {isLoading ? (
            <Loading className="mt-5 w-full" />
          ) : (
            <div className="w-full p-8 text-center">
              <p className="text-3xl font-bold">This account doesn’t exist</p>
              <p className="text-light-secondary dark:text-dark-secondary">
                Try searching for another.
              </p>
            </div>
          )}
        </motion.section>
      ) : (
        <>
          <UserNav follow />
          {children}
        </>
      )}
    </>
  );
}

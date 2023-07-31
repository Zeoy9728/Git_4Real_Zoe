import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { isPlural } from "@/lib/utils";
import { UserName } from "./user-name";
import type { Variants } from "framer-motion";
import { useCharacterByHandle, useNotesOfCharacter } from "@crossbell/indexer";
import { extractCharacterName } from "@crossbell/util-metadata";
import { Fragment } from "react";

export const variants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export function UserHeader(): JSX.Element {
  const {
    pathname,
    query: { id },
  } = useRouter();

  const { data: character, isLoading } = useCharacterByHandle(id as string);
  const characterName = extractCharacterName(character);

  const { data } = useNotesOfCharacter(character?.characterId);

  const [totalTweets, totalPhotos, totalLikes] = [data?.pages?.[0].count, 0, 0];

  const currentPage = pathname.split("/").pop() ?? "";

  const isInTweetPage = ["[id]", "with_replies"].includes(currentPage);
  const isInFollowPage = ["following", "followers"].includes(currentPage);

  return (
    <AnimatePresence mode="popLayout">
      <Fragment>
        {isLoading ? (
          <motion.div
            className="-mb-1 inner:animate-pulse inner:rounded-lg inner:bg-light-secondary dark:inner:bg-dark-secondary"
            {...variants}
            key="loading"
          >
            <div className="-mt-1 mb-1 h-5 w-24" />
            <div className="h-4 w-12" />
          </motion.div>
        ) : !character ? (
          <motion.div
            className="text-xl font-bold"
            {...variants}
            key="not-found"
          >
            {isInFollowPage ? `@${id as string}` : "User"}
          </motion.div>
        ) : (
          <motion.div className="-mb-1 truncate" {...variants} key="found">
            <UserName
              tag="h2"
              name={characterName}
              className="-mt-1 text-xl"
              iconClassName="w-6 h-6"
              verified={false}
            />
            <p className="text-xs text-light-secondary dark:text-dark-secondary">
              {isInFollowPage
                ? `@${character?.handle}`
                : isInTweetPage
                ? totalTweets
                  ? `${totalTweets} ${`Post${isPlural(totalTweets)}`}`
                  : "No Post"
                : currentPage === "media"
                ? totalPhotos
                  ? `${totalPhotos} Photo${isPlural(
                      totalPhotos
                    )} & GIF${isPlural(totalPhotos)}`
                  : "No Photo & GIF"
                : totalLikes
                ? `${totalLikes} Like${isPlural(totalLikes)}`
                : "No Like"}
            </p>
          </motion.div>
        )}
      </Fragment>
    </AnimatePresence>
  );
}

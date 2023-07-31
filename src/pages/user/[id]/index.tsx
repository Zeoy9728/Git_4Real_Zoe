import { AnimatePresence } from "framer-motion";
import { UserLayout, ProtectedLayout } from "@/components/layout/common-layout";
import { MainLayout } from "@/components/layout/main-layout";
import { UserDataLayout } from "@/components/layout/user-data-layout";
import { UserHomeLayout } from "@/components/layout/user-home-layout";
import { StatsEmpty } from "@/components/tweet/stats-empty";
import { Loading } from "@/components/ui/loading";
import { Tweet } from "@/components/tweet/tweet";
import { Fragment, ReactElement, ReactNode } from "react";
import { useRouter } from "next/router";
import { useCharacterByHandle, useNotesOfCharacter } from "@crossbell/indexer";
import { LoadMore } from "@/components/ui/load-more";
import { decomposeNoteId } from "@crossbell/util-metadata";
import { useNote } from "@crossbell/indexer";

export default function UserTweets(): JSX.Element {
  const {
    query: { id },
  } = useRouter();
  const { data: character, isLoading: peopleLoading } = useCharacterByHandle(
    id as string
  );
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading: tweetLoading,
  } = useNotesOfCharacter(character?.characterId);

  const pinned = character?.metadata?.content?.attributes?.find(
    (attr) => attr.trait_type === "4real_pinned_tweet"
  )?.value as string;

  const { data: pinnedTweet, isLoading: pinnedTweetLoading } = useNote(
    pinned ? decomposeNoteId(pinned).characterId : 0,
    pinned ? decomposeNoteId(pinned).noteId : 0,
    {
      enabled: !!pinned,
    }
  );

  const tweetList =
    data?.pages
      .flatMap((page) => page.list)
      .filter(
        (tweet) =>
          `${tweet.characterId}-${tweet.noteId}` !== pinned &&
          !tweet.metadata?.content?.tags?.includes("page")
      ) || [];

  return (
    <section>
      {peopleLoading || tweetLoading ? (
        <Loading className="mt-5" />
      ) : !data?.pages.length ? (
        <StatsEmpty
          title={`@${character?.handle} hasn't posted`}
          description="When they do, their posts will show up here."
        />
      ) : (
        <>
          <AnimatePresence mode="popLayout" initial={false}>
            <Fragment>
              {!pinnedTweetLoading && pinnedTweet && (
                <Tweet
                  key={`${pinnedTweet.characterId}-${pinnedTweet.noteId}`}
                  pinned={true}
                  {...pinnedTweet}
                />
              )}
              {tweetList.map((tweet) => (
                <Tweet
                  key={`${tweet.characterId}-${tweet.noteId}`}
                  {...tweet}
                />
              ))}
            </Fragment>
          </AnimatePresence>
          <LoadMore {...{ hasNextPage, fetchNextPage }} />
        </>
      )}
    </section>
  );
}

UserTweets.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <UserLayout>
        <UserDataLayout>
          <UserHomeLayout>{page}</UserHomeLayout>
        </UserDataLayout>
      </UserLayout>
    </MainLayout>
  </ProtectedLayout>
);

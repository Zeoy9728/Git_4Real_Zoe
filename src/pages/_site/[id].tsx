import { AnimatePresence } from "framer-motion";
import { UserHomeLayout } from "@/components/layout/user-home-layout";
import { StatsEmpty } from "@/components/tweet/stats-empty";
import { Loading } from "@/components/ui/loading";
import { Tweet } from "@/components/tweet/tweet";
import { Fragment, ReactElement, ReactNode } from "react";
import { useRouter } from "next/router";
import { useCharacterByHandle, useNotesOfCharacter } from "@crossbell/indexer";
import { LoadMore } from "@/components/ui/load-more";
import { SiteDataLayout } from "@/components/layout/site-data-layout";

export default function UserSite(): JSX.Element {
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
              {data.pages.map((page) =>
                page.list.map((tweet, index) => (
                  <Tweet
                    key={`${tweet.characterId}-${tweet.noteId}`}
                    {...tweet}
                  />
                ))
              )}
            </Fragment>
          </AnimatePresence>
          <LoadMore {...{ hasNextPage, fetchNextPage }} />
        </>
      )}
    </section>
  );
}

UserSite.getLayout = (page: ReactElement): ReactNode => (
  <div className="flex justify-center w-full mx-auto">
    <SiteDataLayout>
      <UserHomeLayout>{page}</UserHomeLayout>
    </SiteDataLayout>
  </div>
);

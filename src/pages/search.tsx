import { SEO } from "@/components/common/seo";
import { MainContainer } from "@/components/home/main-container";
import { MainHeader } from "@/components/home/main-header";
import { HomeLayout, ProtectedLayout } from "@/components/layout/common-layout";
import { MainLayout } from "@/components/layout/main-layout";
import { Error } from "@/components/ui/error";
import { Loading } from "@/components/ui/loading";
import { UserCard } from "@/components/user/user-card";
import { AnimatePresence } from "framer-motion";
import { Fragment, ReactNode } from "react";
import { useSearchingCharacters, useSearchingNotes } from "@crossbell/indexer";
import { useRouter } from "next/router";
import { Tweet } from "@/components/tweet/tweet";
import { LoadMore } from "@/components/ui/load-more";

export default function SearchResultPage() {
  const router = useRouter();
  const query = router.query.q as string;
  const { data: characterData, isLoading: isLoadingCharacter } =
    useSearchingCharacters(query, {
      limit: 5,
    });
  const {
    data: noteData,
    hasNextPage,
    fetchNextPage,
    isLoading: isLoadingNote,
  } = useSearchingNotes(query);

  const characters = characterData?.pages.flatMap((page) => page.list) ?? [];
  const notes = noteData?.pages.flatMap((page: any) => page.list) ?? [];

  return (
    <MainContainer>
      <SEO title="Search Result / 4Real" />
      <MainHeader
        useMobileSidebar
        title="Search Result"
        className="flex items-center justify-between"
      >
        <div className="h-9"></div>
      </MainHeader>
      <section className="mt-0.5 xs:mt-0">
        {isLoadingNote && isLoadingCharacter ? (
          <Loading className="mt-5" />
        ) : !characterData?.pages.length ? (
          <Error message="Something went wrong" />
        ) : (
          <>
            <AnimatePresence mode="popLayout" initial={false}>
              <Fragment>
                {characters.map((character) => (
                  <UserCard key={character.characterId} {...character} />
                ))}
                <div className="h-4 border-b border-light-border dark:border-dark-border"></div>
                {notes.map((tweet) => (
                  <Tweet
                    key={`${tweet.characterId}-${tweet.noteId}`}
                    {...tweet}
                  />
                ))}
              </Fragment>
              <LoadMore {...{ hasNextPage, fetchNextPage }} />
            </AnimatePresence>
          </>
        )}
      </section>
    </MainContainer>
  );
}

SearchResultPage.getLayout = (page: ReactNode) => {
  return (
    <ProtectedLayout>
      <MainLayout>
        <HomeLayout>{page}</HomeLayout>
      </MainLayout>
    </ProtectedLayout>
  );
};

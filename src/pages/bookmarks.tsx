import { SEO } from "@/components/common/seo";
import { MainContainer } from "@/components/home/main-container";
import { MainHeader } from "@/components/home/main-header";
import { HomeLayout, ProtectedLayout } from "@/components/layout/common-layout";
import { MainLayout } from "@/components/layout/main-layout";
import { Tweet } from "@/components/tweet/tweet";
import { Error } from "@/components/ui/error";
import { LoadMore } from "@/components/ui/load-more";
import { Loading } from "@/components/ui/loading";
import { useLikedNoteOfCharacter } from "@/query/note";
import { useAccountCharacter } from "@crossbell/connect-kit";
import { AnimatePresence } from "framer-motion";
import { Fragment, ReactNode, useEffect } from "react";

export default function BookmarkPage() {
  const currentCharacter = useAccountCharacter();
  const { data, isLoading, hasNextPage, fetchNextPage, refetch } =
    useLikedNoteOfCharacter(currentCharacter?.characterId, {
      limit: 20,
    });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 15000);
    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <MainContainer>
      <SEO title="Bookmark / 4Real" />
      <MainHeader
        useMobileSidebar
        title="Bookmark"
        className="flex items-center justify-between"
      >
        <div className="h-9"></div>
      </MainHeader>
      <section className="mt-0.5 xs:mt-0">
        {isLoading ? (
          <Loading className="mt-5" />
        ) : !data?.pages.length ? (
          <Error message="Something went wrong" />
        ) : (
          <>
            <AnimatePresence mode="popLayout" initial={false}>
              <Fragment>
                {data.pages.map((page) =>
                  page.list.map((linkNote) => {
                    const tweet = linkNote.toNote;
                    if (!tweet) return null;
                    return (
                      <Tweet
                        key={`${tweet.characterId}-${tweet.noteId}`}
                        {...tweet}
                      />
                    );
                  })
                )}
              </Fragment>
            </AnimatePresence>
            <LoadMore {...{ hasNextPage, fetchNextPage }} />
          </>
        )}
      </section>
    </MainContainer>
  );
}

BookmarkPage.getLayout = (page: ReactNode) => {
  return (
    <ProtectedLayout>
      <MainLayout>
        <HomeLayout>{page}</HomeLayout>
      </MainLayout>
    </ProtectedLayout>
  );
};

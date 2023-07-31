import { SEO } from "@/components/common/seo";
import { MainContainer } from "@/components/home/main-container";
import { MainHeader } from "@/components/home/main-header";
import { HomeLayout, ProtectedLayout } from "@/components/layout/common-layout";
import { MainLayout } from "@/components/layout/main-layout";
import { Tweet } from "@/components/tweet/tweet";
import { Error } from "@/components/ui/error";
import { LoadMore } from "@/components/ui/load-more";
import { Loading } from "@/components/ui/loading";
import { useConnectedAccount } from "@crossbell/connect-kit";
import { useMintedNotesOfAddress } from "@crossbell/indexer";
import { AnimatePresence } from "framer-motion";
import { Fragment, ReactNode, useEffect } from "react";

export default function TreasurePage() {
  const account = useConnectedAccount("wallet");

  const { data, isLoading, hasNextPage, fetchNextPage, refetch } =
    useMintedNotesOfAddress(account?.address, {
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
      <SEO title="Treasure / 4Real" />
      <MainHeader
        useMobileSidebar
        title="Treasure"
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
                  page.list.map((mintNote) => {
                    const tweet = mintNote.note;
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

TreasurePage.getLayout = (page: ReactNode) => {
  return (
    <ProtectedLayout>
      <MainLayout>
        <HomeLayout>{page}</HomeLayout>
      </MainLayout>
    </ProtectedLayout>
  );
};

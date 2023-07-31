import { SEO } from "@/components/common/seo";
import { MainContainer } from "@/components/home/main-container";
import { MainHeader } from "@/components/home/main-header";
import { Input } from "@/components/input/input";
import { HomeLayout, ProtectedLayout } from "@/components/layout/common-layout";
import { MainLayout } from "@/components/layout/main-layout";
import { Tweet } from "@/components/tweet/tweet";
import { Error } from "@/components/ui/error";
import { LoadMore } from "@/components/ui/load-more";
import { Loading } from "@/components/ui/loading";
import { useAccountState } from "@crossbell/connect-kit";
import { useNotes } from "@crossbell/indexer";
import { AnimatePresence } from "framer-motion";
import { Fragment, ReactNode, useEffect } from "react";

export default function HomePage() {
  const [isConnected] = useAccountState(({ computed }) => [!!computed.account]);
  const { data, isLoading, hasNextPage, fetchNextPage, refetch } = useNotes({
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
      <SEO title="Home / 4Real" />
      <MainHeader
        useMobileSidebar
        title="Home"
        className="flex items-center justify-between"
        displayScrollToTop={true}
      >
        <div className="h-9"></div>
      </MainHeader>
      {isConnected && (
        <div className="hidden min-[500px]:block">
          <Input />
        </div>
      )}
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
                  page.list.map((tweet) => (
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
    </MainContainer>
  );
}

HomePage.getLayout = (page: ReactNode) => {
  return (
    <ProtectedLayout>
      <MainLayout>
        <HomeLayout>{page}</HomeLayout>
      </MainLayout>
    </ProtectedLayout>
  );
};

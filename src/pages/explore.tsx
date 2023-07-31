import { SEO } from "@/components/common/seo";
import { MainContainer } from "@/components/home/main-container";
import { MainHeader } from "@/components/home/main-header";
import {
  ExploreLayout,
  ProtectedLayout,
} from "@/components/layout/common-layout";
import { MainLayout } from "@/components/layout/main-layout";
import { Error } from "@/components/ui/error";
import { LoadMore } from "@/components/ui/load-more";
import { Loading } from "@/components/ui/loading";
import { UserCard } from "@/components/user/user-card";
import { useTrending } from "@/query/trending";
import { AnimatePresence } from "framer-motion";
import compact from "lodash.compact";
import { Fragment, ReactNode, useMemo } from "react";

export default function ExplorePage() {
  const { data, isLoading, hasNextPage, fetchNextPage } =
    useTrending("character");

  const characters = useMemo(
    () => compact(data?.pages.flatMap((page) => page.items)),
    [data]
  );
  return (
    <MainContainer>
      <SEO title="Explore / 4Real" />
      <MainHeader
        useMobileSidebar
        title="Explore"
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
                {characters.map((character) => (
                  <UserCard key={character.characterId} {...character} />
                ))}
              </Fragment>
            </AnimatePresence>
            <LoadMore {...{ hasNextPage, fetchNextPage }} />
          </>
        )}
      </section>
    </MainContainer>
  );
}

ExplorePage.getLayout = (page: ReactNode) => {
  return (
    <ProtectedLayout>
      <MainLayout>
        <ExploreLayout>{page}</ExploreLayout>
      </MainLayout>
    </ProtectedLayout>
  );
};

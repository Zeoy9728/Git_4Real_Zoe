import { Fragment, useRef } from "react";
import { useRouter } from "next/router";
import { AnimatePresence } from "framer-motion";
import { HomeLayout, ProtectedLayout } from "@/components/layout/common-layout";
import { MainLayout } from "@/components/layout/main-layout";
import { MainContainer } from "@/components/home/main-container";
import { MainHeader } from "@/components/home/main-header";
import { Tweet } from "@/components/tweet/tweet";
import { ViewTweet } from "@/components/view/view-tweet";
import { SEO } from "@/components/common/seo";
import { Loading } from "@/components/ui/loading";
import { Error } from "@/components/ui/error";
import { ViewParentTweet } from "@/components/view/view-parent-tweet";
import type { ReactElement, ReactNode } from "react";
import { useRouterNote } from "@/lib/hooks/useRouterNote";
import { extractCharacterName } from "@crossbell/util-metadata";
import { useNotesForNote } from "@crossbell/indexer";

export default function TweetId(): JSX.Element {
  const { back } = useRouter();
  const {
    note: tweetData,
    character,
    noteId,
    characterId,
    isLoading: tweetLoading,
  } = useRouterNote();
  const { data: repliesData, isLoading: repliesLoading } = useNotesForNote(
    characterId,
    noteId
  );
  const viewTweetRef = useRef<HTMLElement>(null);

  const pageTitle = tweetData
    ? `${extractCharacterName(character)}: "${
        tweetData.metadata?.content?.content ?? ""
      }"`
    : null;

  const replies = repliesData?.pages.flatMap((page) => page.list) ?? [];

  const parentId = tweetData?.toNote?.noteId
    ? `${tweetData.toNote.characterId}-${tweetData.toNote.noteId}`
    : null;

  return (
    <MainContainer>
      <MainHeader
        useActionButton
        title={parentId ? "Thread" : "Tweet"}
        action={back}
      />
      <section>
        {tweetLoading ? (
          <Loading className="mt-5" />
        ) : !tweetData ? (
          <>
            <SEO title="Post not found / 4Real" />
            <Error message="Post not found" />
          </>
        ) : (
          <>
            {pageTitle && <SEO title={pageTitle} />}
            {parentId && (
              <ViewParentTweet id={parentId} viewTweetRef={viewTweetRef} />
            )}
            <ViewTweet viewTweetRef={viewTweetRef} tweet={tweetData} />
            {tweetData &&
              (repliesLoading ? (
                <Loading className="mt-5" />
              ) : (
                <AnimatePresence mode="popLayout">
                  <Fragment>
                    {replies.map((tweet) => (
                      <Tweet
                        key={`${tweet.characterId}-${tweet.noteId}`}
                        {...tweet}
                      />
                    ))}
                  </Fragment>
                </AnimatePresence>
              ))}
          </>
        )}
      </section>
    </MainContainer>
  );
}

TweetId.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </ProtectedLayout>
);

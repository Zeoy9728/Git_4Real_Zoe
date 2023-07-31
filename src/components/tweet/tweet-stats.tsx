import { useState, useEffect, useMemo } from "react";
import cn from "clsx";
import { TweetOption } from "./tweet-option";
import { TweetShare } from "./tweet-share";
import { NoteEntity } from "crossbell";
import { useNoteStatus } from "@crossbell/indexer";
import {
  useAccountCharacter,
  useConnectedAccount,
  useIsNoteLiked,
  useMintNote,
  useNoteLikeCount,
  useTipList,
  useToggleLikeNote,
} from "@crossbell/connect-kit";
import { ViewTweetStats } from "../view/view-tweet-stats";
import { useStat } from "@/query/stat";
import { useLikedNoteOfCharacter } from "@/query/note";

type TweetStatsProps = {
  tweet: NoteEntity;
  viewTweet?: boolean;
  openModal?: () => void;
  openPatronModal?: () => void;
};

export function TweetStats({
  tweet,
  viewTweet,
  openModal,
  openPatronModal,
}: TweetStatsProps): JSX.Element {
  const account = useConnectedAccount("wallet");
  const { data: status } = useNoteStatus({
    characterId: tweet.characterId,
    noteId: tweet.noteId,
    address: account?.address,
  });
  const { data: viewStatus } = useStat(
    tweet.characterId,
    tweet.noteId,
    !!viewTweet
  );
  const { data: tipList } = useTipList({
    toCharacterId: tweet.characterId,
    toNoteId: tweet.noteId,
  });
  const { data: likeCount } = useNoteLikeCount(tweet);
  const [{ isLiked }] = useIsNoteLiked(tweet);
  const currentCharacter = useAccountCharacter();
  const { refetch } = useLikedNoteOfCharacter(currentCharacter?.characterId, {
    limit: 20,
  });

  const [
    { currentViews, currentReplies, currentMints, currentLikes, currentTips },
    setCurrentStats,
  ] = useState({
    currentViews: viewStatus?.viewCount,
    currentReplies: status?.commentCount,
    currentLikes: likeCount,
    currentMints: status?.mintCount,
    currentTips: tipList?.pages[0]?.count,
  });

  useEffect(() => {
    setCurrentStats({
      currentViews: viewStatus?.viewCount,
      currentReplies: status?.commentCount,
      currentLikes: likeCount,
      currentMints: status?.mintCount,
      currentTips: tipList?.pages[0]?.count,
    });
  }, [
    status?.commentCount,
    likeCount,
    status?.mintCount,
    viewStatus?.viewCount,
    tipList?.pages,
  ]);

  const replyMove = useMemo(
    () => ((status?.commentCount ?? 0) > (currentReplies ?? 0) ? -25 : 25),
    [currentReplies, status?.commentCount]
  );

  const likeMove = useMemo(
    () => ((likeCount ?? 0) > (currentLikes ?? 0) ? -25 : 25),
    [currentLikes, likeCount]
  );

  const mintMove = useMemo(
    () => ((status?.mintCount ?? 0) > (currentMints ?? 0) ? -25 : 25),
    [currentMints, status?.mintCount]
  );

  const viewMove = useMemo(
    () => ((viewStatus?.viewCount ?? 0) > (currentViews ?? 0) ? -25 : 25),
    [currentViews, viewStatus?.viewCount]
  );

  const tipMove = useMemo(
    () => ((tipList?.pages[0]?.count ?? 0) > (currentTips ?? 0) ? -25 : 25),
    [currentTips, tipList?.pages]
  );

  const toggleLikeNote = useToggleLikeNote();
  const mintNote = useMintNote();

  return (
    <>
      {viewTweet && (
        <ViewTweetStats
          isStatsVisible={true}
          viewMove={viewMove}
          likeMove={likeMove}
          replyMove={replyMove}
          mintMove={mintMove}
          tipMove={tipMove}
          currentViews={currentViews}
          currentLikes={currentLikes}
          currentReplies={currentReplies}
          currentMints={currentMints}
          currentTips={currentTips}
        />
      )}
      <div
        className={cn(
          "flex text-light-secondary inner:outline-none dark:text-dark-secondary",
          viewTweet ? "justify-around py-2" : "max-w-md justify-between"
        )}
      >
        <TweetOption
          className="hover:text-accent-blue focus-visible:text-accent-blue"
          iconClassName="group-hover:bg-accent-blue/10 group-active:bg-accent-blue/20 
                         group-focus-visible:bg-accent-blue/10 group-focus-visible:ring-accent-blue/80"
          tip="Reply"
          move={replyMove}
          stats={currentReplies}
          iconName="ChatBubbleOvalLeftIcon"
          viewTweet={viewTweet}
          onClick={openModal}
        />
        <TweetOption
          className={cn(
            "hover:text-accent-pink focus-visible:text-accent-pink",
            isLiked && "text-accent-pink [&>i>svg]:fill-accent-pink"
          )}
          iconClassName="group-hover:bg-accent-pink/10 group-active:bg-accent-pink/20
                         group-focus-visible:bg-accent-pink/10 group-focus-visible:ring-accent-pink/80"
          tip={isLiked ? "Unlike" : "Like"}
          move={likeMove}
          stats={currentLikes}
          iconName="HeartIcon"
          viewTweet={viewTweet}
          onClick={() => {
            toggleLikeNote.mutate(
              {
                characterId: tweet.characterId,
                noteId: tweet.noteId,
                action: isLiked ? "unlink" : "link",
              },
              {
                onSuccess: () => {
                  refetch();
                  setCurrentStats((prev) => ({
                    ...prev,
                    currentLikes: prev.currentLikes ?? 0 + (isLiked ? -1 : 1),
                  }));
                },
              }
            );
          }}
        />
        <TweetOption
          className={cn(
            "hover:text-accent-green focus-visible:text-accent-green",
            !!status?.isMinted &&
              "text-accent-green [&>i>svg]:[stroke-width:2px]"
          )}
          iconClassName="group-hover:bg-accent-green/10 group-active:bg-accent-green/20
                         group-focus-visible:bg-accent-green/10 group-focus-visible:ring-accent-green/80"
          tip={"Mint"}
          move={mintMove}
          stats={currentMints}
          iconName="BookmarkIcon"
          viewTweet={viewTweet}
          onClick={() => {
            if (!status?.isMinted) {
              mintNote.mutate(tweet, {
                onSuccess: () => {
                  setCurrentStats((prev) => ({
                    ...prev,
                    currentMints: prev.currentMints ?? 0 + 1,
                  }));
                },
              });
            }
          }}
        />
        <TweetOption
          className="hover:text-accent-yellow focus-visible:text-accent-yellow"
          iconClassName="group-hover:bg-accent-yellow/10 group-active:bg-accent-yellow/20
                         group-focus-visible:bg-accent-yellow/10 group-focus-visible:ring-accent-yellow/80"
          tip={"Patron"}
          move={tipMove}
          stats={currentTips}
          iconName="CurrencyDollarIcon"
          viewTweet={viewTweet}
          onClick={() => {
            openPatronModal?.();
          }}
        />
        <TweetShare
          tweetId={`${tweet.characterId}-${tweet.noteId}`}
          viewTweet={viewTweet}
        />
      </div>
    </>
  );
}

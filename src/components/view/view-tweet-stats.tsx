import cn from "clsx";
import { NumberStats } from "@/components/tweet/number-stats";

type viewTweetStats = any;

export type StatsType = "view" | "replies" | "marked" | "minted" | "sponsor";

type Stats = [string, StatsType | null, number, number];

export function ViewTweetStats({
  viewMove,
  replyMove,
  likeMove,
  mintMove,
  tipMove,
  currentViews,
  currentReplies,
  currentLikes,
  currentMints,
  currentTips,
  isStatsVisible,
}: viewTweetStats): JSX.Element {
  const allStats: Readonly<Stats[]> = [
    ["View", "view", viewMove, currentViews],
    ["Reply", "replies", replyMove, currentReplies],
    ["Bookmark", "marked", likeMove, currentLikes],
    ["Mint", "minted", mintMove, currentMints],
    ["Sponsor", "sponsor", tipMove, currentTips],
  ];

  if (allStats.every(([_, __, ___, count]) => !count)) return <></>;

  return (
    <>
      {isStatsVisible && (
        <div
          className="flex gap-4 px-1 py-4 text-light-secondary dark:text-dark-secondary
                     [&>button>div]:font-bold [&>button>div]:text-light-primary 
                     dark:[&>button>div]:text-dark-primary"
        >
          {allStats.map(
            ([title, _, move, stats], index) =>
              !!stats && (
                <button
                  className={cn(
                    `hover-animation mb-[3px] mt-0.5 flex h-4 cursor-default items-center gap-1 
                     border-b border-b-transparent outline-none`
                  )}
                  key={title}
                >
                  <NumberStats move={move} stats={stats} />
                  <p>{`${
                    stats === 1
                      ? title
                      : stats > 1 && index === 1
                      ? `${title.slice(0, -1)}ies`
                      : `${title}s`
                  }`}</p>
                </button>
              )
          )}
        </div>
      )}
    </>
  );
}

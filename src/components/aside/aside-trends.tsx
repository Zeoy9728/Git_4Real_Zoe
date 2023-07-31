import cn from "clsx";
import { motion } from "framer-motion";
import { Error } from "@/components/ui/error";
import { Loading } from "@/components/ui/loading";
import type { MotionProps } from "framer-motion";
import { useTrending } from "@/query/trending";
import TweetListItem from "../tweet/tweet-list-item";

export const variants: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8 },
};

type AsideTrendsProps = {
  inTrendsPage?: boolean;
};

export function AsideTrends({ inTrendsPage }: AsideTrendsProps): JSX.Element {
  const { data, isLoading } = useTrending("note");

  return (
    <section
      className={cn(
        !inTrendsPage &&
          "hover-animation rounded-2xl bg-main-sidebar-background"
      )}
    >
      {isLoading ? (
        <Loading className="flex h-52 items-center justify-center p-4" />
      ) : data?.pages ? (
        <motion.div
          className={cn("flex flex-col py-3", inTrendsPage && "mt-0.5")}
          {...variants}
        >
          {!inTrendsPage && (
            <h2 className="mb-2 px-4 text-xl font-extrabold">Trends for you</h2>
          )}
          {data.pages.map((page) =>
            page.items
              ?.slice(0, 3)
              .map((note) => (
                <TweetListItem
                  key={`${note.characterId}-${note.noteId}`}
                  tweet={note}
                />
              ))
          )}
        </motion.div>
      ) : (
        <Error />
      )}
    </section>
  );
}

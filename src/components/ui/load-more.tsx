import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Loading } from "./loading";
import { useEffect } from "react";

export function LoadMore({
  marginBottom,
  fetchNextPage,
  hasNextPage,
}: {
  marginBottom?: number;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
}) {
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  if (!hasNextPage) return null;

  return (
    <motion.div
      onClick={fetchNextPage}
      ref={ref}
      className="block"
      viewport={{ margin: `0px 0px ${marginBottom ?? 1000}px` }}
    >
      <Loading className="mt-5" />
    </motion.div>
  );
}

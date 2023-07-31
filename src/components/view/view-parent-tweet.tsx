import { useEffect } from "react";
import { Tweet } from "@/components/tweet/tweet";
import type { RefObject } from "react";
import { decomposeNoteId } from "@crossbell/util-metadata";
import { useNote } from "@crossbell/indexer";

type ViewParentTweetProps = {
  id: string;
  viewTweetRef: RefObject<HTMLElement>;
};

export function ViewParentTweet({
  id,
  viewTweetRef,
}: ViewParentTweetProps): JSX.Element | null {
  const { characterId, noteId } = decomposeNoteId(id);
  const { data, isLoading } = useNote(characterId, noteId);

  useEffect(() => {
    if (!isLoading) {
      viewTweetRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.noteId, isLoading]);

  if (isLoading) return null;
  if (!data)
    return (
      <div className="px-4 pb-2 pt-3">
        <p className="rounded-2xl bg-main-sidebar-background px-1 py-3 pl-4 text-light-secondary dark:text-dark-secondary">
          This post was deleted by author.
        </p>
      </div>
    );

  return <Tweet parentTweet {...data} />;
}

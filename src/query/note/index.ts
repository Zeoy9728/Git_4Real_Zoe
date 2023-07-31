import { useInfiniteQuery } from "@tanstack/react-query";
import { Numberish } from "crossbell";
import { indexer } from "@crossbell/indexer";

const SCOPE_KEY = ["indexer", "likedNotes"];

export const SCOPE_KEY_LIKED_NOTE_OF_ADDRESS = (
  characterId: number,
  options: { limit?: Numberish } = {}
) => {
  return [...SCOPE_KEY, "characterId", characterId, options];
};

export const useLikedNoteOfCharacter = (
  characterId?: number,
  { limit = 20 }: { limit?: number } = {}
) => {
  return useInfiniteQuery(
    SCOPE_KEY_LIKED_NOTE_OF_ADDRESS(characterId!, { limit }),
    ({ pageParam }) =>
      indexer.link.getMany(characterId!, {
        linkType: "like",
        cursor: pageParam,
        limit,
      }),

    {
      enabled: Boolean(characterId),
      getNextPageParam: (lastPage) => lastPage.cursor,
    }
  );
};

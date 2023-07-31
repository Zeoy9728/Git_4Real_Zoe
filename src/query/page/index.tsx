import { useInfiniteQuery } from "@tanstack/react-query";
import { indexer } from "@crossbell/indexer";
import { siteName } from "@/lib/env";

const SCOPE_KEY = ["indexer", "pages"];

export const SCOPE_KEY_PAGES_OF_CHARACTER = (characterId: number) => {
  return [...SCOPE_KEY, "list", characterId];
};

export function usePagesOfCharacter(characterId?: number) {
  return useInfiniteQuery(
    SCOPE_KEY_PAGES_OF_CHARACTER(characterId!),
    ({ pageParam }) =>
      indexer.note
        .getMany({
          characterId,
          cursor: pageParam,
          limit: 20,
          tags: ["page"],
          sources: [siteName],
        })
        .then((res) => {
          return {
            ...res,
            list: res.list.filter((note) => !note.deleted),
          };
        }),
    {
      enabled: Boolean(characterId),
      getNextPageParam: (lastPage) => lastPage.cursor,
    }
  );
}

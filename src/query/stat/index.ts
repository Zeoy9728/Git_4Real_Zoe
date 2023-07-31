import { useQuery } from "@tanstack/react-query";

export function useStat(characterId: number, noteId: number, enable: boolean) {
  return useQuery(
    ["stat", characterId, noteId],
    async () => {
      const raw = await fetch(
        `https://indexer.crossbell.io/v1/stat/notes/${characterId}/${noteId}`
      );
      return raw.json();
    },
    {
      enabled: enable,
    }
  );
}

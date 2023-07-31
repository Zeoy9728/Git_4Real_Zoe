import { useRouter } from "next/router";
import { decomposeNoteId } from "@crossbell/util-metadata";
import { useCharacter, useNote } from "@crossbell/indexer";

export function useRouterNote() {
  const router = useRouter();
  const { id } = router.query;
  const { characterId, noteId } = decomposeNoteId(`${id}`);
  const { data: note, isLoading: isLoading1 } = useNote(characterId, noteId);
  const { data: character, isLoading: isLoading2 } = useCharacter(characterId);

  return {
    characterId,
    noteId,
    note,
    character,
    isLoading: isLoading1 || isLoading2,
  };
}

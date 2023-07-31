import { useCharacter } from "@crossbell/indexer";
import { NoteEntity } from "crossbell";

export function useNoteCharacter(note: NoteEntity | null | undefined) {
  const { data, ...query } = useCharacter(note?.characterId, {
    enabled: !note?.character && !!note?.characterId,
  });

  return { character: data ?? note?.character, ...query };
}

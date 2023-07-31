import { CharacterEntity, NoteEntity } from "crossbell";
import { composeNoteId } from "@crossbell/util-metadata";

export const composeCharacterHref = (
  character: Pick<CharacterEntity, "handle"> | null | undefined
) => {
  return character ? `/u/${character.handle}` : "";
};

export const composeCharacterFollowingHref = (
  character: Pick<CharacterEntity, "handle"> | null | undefined
) => {
  return character ? `${composeCharacterHref(character)}/following` : "";
};

export const composeCharacterFollowersHref = (
  character: Pick<CharacterEntity, "handle"> | null | undefined
) => {
  return character ? `${composeCharacterHref(character)}/followers` : "";
};

export const composeNoteHref = (
  note: Pick<NoteEntity, "noteId" | "characterId"> | null | undefined
) => {
  return note ? `/notes/${composeNoteId(note.characterId, note.noteId)}` : "";
};

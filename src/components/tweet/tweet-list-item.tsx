import {
  extractCharacterName,
  extractPlainTextFromNote,
} from "@crossbell/util-metadata";
import { CharacterAvatar } from "@crossbell/ui";
import type { NoteEntity } from "crossbell";
import { useCharacter } from "@crossbell/indexer";
import { formatDate } from "@/lib/date";
import { UserTooltip } from "../user/user-tooltip";
import { UserName } from "../user/user-name";
import { UserUsername } from "../user/user-username";
import { useRouter } from "next/router";
import { Markdown } from "../rehype/markdown";

export default function TweetListItem({ tweet }: { tweet: NoteEntity }) {
  const router = useRouter();
  const { data: character } = useCharacter(tweet.characterId);
  const content = extractPlainTextFromNote(tweet.metadata?.content);

  return (
    <div
      className="relative flex flex-col gap-2 p-4 cursor-pointer hover-animation accent-tab hover-card"
      onClick={() => router.push(`/post/${tweet.characterId}-${tweet.noteId}`)}
    >
      <div className="flex flex-row items-center space-x-2">
        <UserTooltip character={character!}>
          <CharacterAvatar characterId={tweet.characterId} size={48} />
        </UserTooltip>
        <div className="flex flex-col justify-center truncate xs:overflow-visible xs:whitespace-normal">
          <UserTooltip character={character!}>
            <UserName
              name={extractCharacterName(character)}
              className="-mb-1"
              verified={false}
            />
          </UserTooltip>
          <div className="flex items-center gap-1 text-light-secondary dark:text-dark-secondary">
            <UserTooltip character={character!}>
              <UserUsername username={character?.handle ?? ""} />
            </UserTooltip>
          </div>
        </div>
      </div>
      <div className="overflow-hidden line-clamp-3">
        <Markdown previewLink={true} content={content ?? ""} />
      </div>
      <span className="text-sm text-light-secondary dark:text-dark-secondary">
        {formatDate(tweet.createdAt, "tweet")}
      </span>
    </div>
  );
}

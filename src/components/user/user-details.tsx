import { UserName } from "./user-name";
// import { UserFollowing } from "./user-following";
import { UserFollowStats } from "./user-follow-stats";
import { extractCharacterName } from "@crossbell/util-metadata";
import { useCharacterFollowStats } from "@crossbell/indexer";
import type { CharacterEntity } from "crossbell";
import { Platform } from "../common/platform";

type UserDetailsProps = {
  character: CharacterEntity;
};

export function UserDetails({ character }: UserDetailsProps): JSX.Element {
  const characterName = extractCharacterName(character);
  const characterBio = character?.metadata?.content?.bio;
  const { data: followStats } = useCharacterFollowStats(character?.characterId);
  const raw = character?.metadata?.content?.connected_accounts;

  return (
    <>
      <div>
        <UserName
          className="-mb-1 text-xl"
          name={characterName}
          iconClassName="w-6 h-6"
          verified={false}
        />
        <div className="flex items-center gap-1 text-light-secondary dark:text-dark-secondary">
          <p>@{character.handle}</p>
          {/* <UserFollowing userTargetId={character.handle} /> */}
        </div>
      </div>
      {raw && (
        <div className="flex flex-row items-center gap-4">
          {raw.map(
            (
              account:
                | string
                | { uri: string }
                | { identity: string; platform: string }
                | any, // Otherwise type check will alarm
              index
            ) => {
              let match: RegExpMatchArray | null = null;
              switch (typeof account) {
                case "string":
                  match = account.match(/:\/\/account:(.*)@(.*)/);
                  break;
                case "object":
                  if (account.uri) {
                    match = account.uri.match(/:\/\/account:(.*)@(.*)/);
                  } else if (account.identity && account.platform) {
                    match = ["", account.identity, account.platform];
                  }
                  break;
              }
              if (match) {
                return (
                  <Platform
                    key={account}
                    platform={match[2]}
                    username={match[1]}
                  ></Platform>
                );
              }
            }
          )}
        </div>
      )}
      <div className="flex flex-col gap-2">
        {characterBio && (
          <p className="break-words whitespace-pre-line">{characterBio}</p>
        )}
      </div>
      <UserFollowStats
        following={followStats?.followingCount ?? 0}
        followers={followStats?.followersCount ?? 0}
      />
    </>
  );
}

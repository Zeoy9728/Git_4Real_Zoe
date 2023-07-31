import { FollowButton } from "@/components/ui/follow-button";
import { UserTooltip } from "./user-tooltip";
import { UserName } from "./user-name";
import { UserUsername } from "./user-username";
import { CharacterEntity } from "crossbell";
import { CharacterAvatar } from "@crossbell/ui";
import { extractCharacterName } from "@crossbell/util-metadata";
import { useRouter } from "next/router";

type UserCardProps = CharacterEntity & {
  modal?: boolean;
};

export function UserCard(user: UserCardProps): JSX.Element {
  const router = useRouter();
  const characterBio = user?.metadata?.content?.bio;

  return (
    <div
      className="accent-tab hover-animation grid cursor-pointer grid-cols-[auto,1fr] gap-3
                   px-4 py-3 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5"
      onClick={() => router.push(`/user/${user.handle}`)}
    >
      <UserTooltip character={user}>
        <CharacterAvatar character={user} size={48} />
      </UserTooltip>
      <div className="flex flex-col gap-1 truncate xs:overflow-visible">
        <div className="flex items-center justify-between gap-2 truncate xs:overflow-visible">
          <div className="flex flex-col justify-center truncate xs:overflow-visible xs:whitespace-normal">
            <UserTooltip character={user} modal={user.modal}>
              <UserName
                name={extractCharacterName(user)}
                className="-mb-1"
                verified={false}
              />
            </UserTooltip>
            <div className="flex items-center gap-1 text-light-secondary dark:text-dark-secondary">
              <UserTooltip character={user} modal={user.modal}>
                <UserUsername username={user?.handle!} />
              </UserTooltip>
              {/* {follow && <UserFollowing userTargetId={id} />} */}
            </div>
          </div>
          <FollowButton character={user} />
        </div>
        {characterBio && <p className="whitespace-normal">{characterBio}</p>}
      </div>
    </div>
  );
}

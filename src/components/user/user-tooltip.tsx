import Link from "next/link";
import type { ReactNode } from "react";
import type { CharacterEntity } from "crossbell";
import { extractCharacterName } from "@crossbell/util-metadata";
import { UserName } from "./user-name";
import { UserUsername } from "./user-username";
import { CharacterAvatar } from "@crossbell/ui";
import { useCharacterFollowStats } from "@crossbell/indexer";
import { NextImage } from "../ui/next-image";
import { FollowButton } from "../ui/follow-button";
import { ipfsLinkToHttpLink } from "@/lib/ipfs";

type UserTooltipProps = {
  modal?: boolean;
  character: CharacterEntity;
  children?: ReactNode;
};

type Stats = [string, string, number];

export function UserTooltip({
  modal,
  character,
  children,
}: UserTooltipProps): JSX.Element {
  const characterName = extractCharacterName(character);
  const characterBio = character?.metadata?.content?.bio;
  const { data: followStats } = useCharacterFollowStats(
    character?.characterId,
    { enabled: !!character && !modal }
  );

  if (modal || !character) return <>{children}</>;

  const allStats: Readonly<Stats[]> = [
    ["following", "Following", followStats?.followingCount ?? 0],
    ["followers", "Followers", followStats?.followersCount ?? 0],
  ];

  const userLink = `/user/${character?.handle}`;
  const banner = character?.metadata?.content?.banners?.[0].address;
  return (
    <>
      <div className="group relative hidden self-start text-light-primary dark:text-dark-primary min-[500px]:block [&>div]:translate-y-2">
        {children}
        <div
          className="menu-container invisible absolute left-1/2 w-72 -translate-x-1/2 rounded-2xl 
                   opacity-0 [transition:visibility_0ms_ease_400ms,opacity_200ms_ease_200ms] group-hover:visible 
                   group-hover:opacity-100 group-hover:delay-500"
        >
          <div className="flex flex-col gap-3 p-4">
            <div className="flex flex-col gap-2">
              <div className="-mx-4 -mt-4">
                {banner ? (
                  <Link href={userLink} className="blur-picture">
                    <NextImage
                      useSkeleton
                      className="relative h-24"
                      imgClassName="rounded-t-2xl"
                      src={ipfsLinkToHttpLink(banner)}
                      alt={characterName}
                      fill={true}
                      unoptimized
                    />
                  </Link>
                ) : (
                  <div className="h-16 rounded-t-2xl bg-light-line-reply dark:bg-dark-line-reply" />
                )}
              </div>
              <div className="flex justify-between">
                <div className="mb-10">
                  <CharacterAvatar
                    size={64}
                    character={character}
                    className="absolute -translate-y-1/2 bg-main-background p-1 
                             hover:brightness-100 [&:hover>figure>span]:brightness-75
                             [&>figure>span]:[transition:200ms]"
                  />
                </div>
                <FollowButton character={character} />
              </div>
              <div>
                <UserName
                  className="-mb-1 text-lg"
                  name={characterName}
                  username={character.handle}
                  verified={false}
                />
                <div className="flex items-center gap-1 text-light-secondary dark:text-dark-secondary">
                  <UserUsername username={character.handle} />
                  {/* <UserFollowing userTargetId={id} /> */}
                </div>
              </div>
            </div>
            {characterBio && <p>{characterBio}</p>}
            <div className="text-secondary flex gap-4">
              {allStats.map(([id, label, stat]) => (
                <Link
                  href={`${userLink}/${id}`}
                  key={id}
                  className="hover-animation flex h-4 items-center gap-1 border-b border-b-transparent outline-none hover:border-b-light-primary focus-visible:border-b-light-primary dark:hover:border-b-dark-primary dark:focus-visible:border-b-dark-primary"
                >
                  <p className="font-bold">{stat}</p>
                  <p className="text-light-secondary dark:text-dark-secondary">
                    {label}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden max-[499px]:block">{children}</div>
    </>
  );
}

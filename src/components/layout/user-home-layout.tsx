import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { SEO } from "@/components/common/seo";
import { UserHomeCover } from "@/components/user/user-home-cover";
import { UserHomeAvatar } from "@/components/user/user-home-avatar";
import { UserDetails } from "@/components/user/user-details";
import { Loading } from "@/components/ui/loading";
import { FollowButton } from "@/components/ui/follow-button";
import { variants } from "@/components/user/user-header";
import { UserEditProfile } from "@/components/user/user-edit-profile";
import { UserShare } from "@/components/user/user-share";
import type { LayoutProps } from "./common-layout";
import { useCharacterByHandle } from "@crossbell/indexer";
import { extractCharacterName } from "@crossbell/util-metadata";
import { useAccountCharacter } from "@crossbell/connect-kit";
import { useCharacterBanner, useCharacterAvatar } from "@crossbell/ui";
import { UserNav } from "../user/user-nav";

export function UserHomeLayout({ children }: LayoutProps): JSX.Element {
  const {
    query: { id },
  } = useRouter();

  const { data: character, isLoading } = useCharacterByHandle(id as string);
  const currentCharacter = useAccountCharacter();

  const characterName = extractCharacterName(character);
  const banner = useCharacterBanner({ character });
  const avatar = useCharacterAvatar({ character });
  const coverData = banner ? { src: banner.url, alt: id as string } : null;

  const profileData = avatar ? { src: avatar.src, alt: id as string } : null;

  const isOwner = character?.handle === currentCharacter?.handle;

  return (
    <>
      {character && (
        <SEO title={`${`${characterName} (@${character?.handle})`} / 4Real`} />
      )}
      <motion.section {...variants} exit={undefined}>
        {isLoading ? (
          <Loading className="mt-5" />
        ) : !character ? (
          <>
            <UserHomeCover />
            <div className="flex flex-col gap-8">
              <div className="relative flex flex-col gap-3 px-4 py-3">
                <UserHomeAvatar />
                <p className="text-xl font-bold">@{id}</p>
              </div>
              <div className="p-8 text-center">
                <p className="text-3xl font-bold">This account doesn’t exist</p>
                <p className="text-light-secondary dark:text-dark-secondary">
                  Try searching for another.
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <UserHomeCover coverData={coverData} />
            <div className="relative flex flex-col gap-3 px-4 py-3">
              <div className="flex justify-between">
                <UserHomeAvatar profileData={profileData} />
                {isOwner ? (
                  <UserEditProfile />
                ) : (
                  <div className="flex self-start gap-2">
                    <UserShare username={character.handle} />
                    <FollowButton character={character} />
                  </div>
                )}
              </div>
              <UserDetails character={character} />
            </div>
          </>
        )}
      </motion.section>
      {character && (
        <>
          <UserNav />
          {children}
        </>
      )}
    </>
  );
}

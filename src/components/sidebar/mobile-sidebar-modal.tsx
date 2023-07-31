import Link from "next/link";
import { useModal } from "@/lib/hooks/useModal";
import { Button } from "@/components/ui/button";
import { NextImage } from "@/components/ui/next-image";
import { UserName } from "@/components/user/user-name";
import { UserUsername } from "@/components/user/user-username";
import { MainHeader } from "@/components/home/main-header";
import { MobileSidebarLink } from "@/components/sidebar/mobile-sidebar-link";
import { HeroIcon } from "@/components/ui/hero-icon";
import { Modal } from "../modal/modal";
import { DisplayModal } from "../modal/display-modal";
import type { NavLink } from "@/components/sidebar/sidebar";
import {
  useAccountCharacter,
  useDisconnectModal,
  useXSettingsModal,
} from "@crossbell/connect-kit";
import { CharacterAvatar } from "@crossbell/ui";
import { useCharacterFollowStats } from "@crossbell/indexer";
import { extractCharacterName } from "@crossbell/util-metadata";
import { ipfsLinkToHttpLink } from "@/lib/ipfs";
import { useShowNotificationModal } from "@crossbell/notification";

export type MobileNavLink = Omit<NavLink, "canBeHidden">;

type Stats = [string, string, number];

type MobileSidebarModalProps = {
  closeModal: () => void;
};

export function MobileSidebarModal({
  closeModal,
}: MobileSidebarModalProps): JSX.Element {
  const showNotificationModal = useShowNotificationModal();
  const currentCharacter = useAccountCharacter();
  const disconnectModal = useDisconnectModal();
  const xSettingsModal = useXSettingsModal();
  const followStats = useCharacterFollowStats(currentCharacter?.characterId);

  const topNavLinks: Readonly<MobileNavLink[]> = [
    {
      href: "/explore",
      linkName: "Explore",
      iconName: "ExploreIcon",
    },
    {
      href: "/bookmarks",
      linkName: "Bookmarks",
      iconName: "BookmarkIcon",
    },
    {
      href: "#",
      linkName: "Notifications",
      iconName: "NotificationIcon",
      onClick: () => showNotificationModal(),
    },
    {
      href: "/token",
      linkName: "Token",
      iconName: "WalletIcon",
    },
  ];

  const {
    open: displayOpen,
    openModal: displayOpenModal,
    closeModal: displayCloseModal,
  } = useModal();

  const allStats: Readonly<Stats[]> = [
    ["following", "Following", followStats.data?.followingCount ?? 0],
    ["followers", "Followers", followStats.data?.followersCount ?? 0],
  ];

  const userLink = `/user/${currentCharacter?.handle}`;
  const banner = currentCharacter?.metadata?.content?.banners?.[0].address;

  return (
    <>
      <Modal
        className="items-center justify-center xs:flex"
        modalClassName="max-w-xl bg-main-background w-full p-8 rounded-2xl hover-animation"
        open={displayOpen}
        closeModal={displayCloseModal}
      >
        <DisplayModal closeModal={displayCloseModal} />
      </Modal>
      <MainHeader
        useActionButton
        className="flex flex-row-reverse items-center justify-between"
        iconName="XMarkIcon"
        title="Account info"
        tip="Close"
        action={closeModal}
      />
      <section className="mt-0.5 flex flex-col gap-2 px-4">
        <Link href={userLink} className="relative h-20 rounded-md blur-picture">
          {banner ? (
            <NextImage
              useSkeleton
              imgClassName="rounded-md"
              src={ipfsLinkToHttpLink(banner)}
              alt={currentCharacter.handle}
              layout="fill"
              unoptimized={true}
            />
          ) : (
            <div className="h-full rounded-md bg-light-line-reply dark:bg-dark-line-reply" />
          )}
        </Link>
        <div className="z-30 ml-3 -mt-12">
          <CharacterAvatar
            className="ring ring-light-primary"
            character={currentCharacter}
            size={60}
          />
        </div>
        <div className="flex flex-col gap-4 p-4 rounded-xl bg-main-sidebar-background">
          <div className="flex flex-col">
            <UserName
              name={extractCharacterName(currentCharacter)}
              className="-mb-1"
              verified={false}
            />
            <UserUsername username={currentCharacter?.handle!} disableLink />
          </div>
          <div className="flex gap-4 text-secondary">
            {allStats.map(([id, label, stat]) => (
              <Link
                href={`${userLink}/${id}`}
                key={id}
                className="flex items-center h-4 gap-1 border-b outline-none hover-animation border-b-transparent hover:border-b-light-primary focus-visible:border-b-light-primary dark:hover:border-b-dark-primary dark:focus-visible:border-b-dark-primary"
              >
                <p className="font-bold">{stat}</p>
                <p className="text-light-secondary dark:text-dark-secondary">
                  {label}
                </p>
              </Link>
            ))}
          </div>
          <i className="h-0.5 bg-light-line-reply dark:bg-dark-line-reply" />
          <nav className="flex flex-col">
            <MobileSidebarLink
              href={userLink}
              iconName="UserIcon"
              linkName="Profile"
            />
            {topNavLinks.map((linkData) => (
              <MobileSidebarLink {...linkData} key={linkData.href} />
            ))}
          </nav>
          <i className="h-0.5 bg-light-line-reply dark:bg-dark-line-reply" />
          <nav className="flex flex-col">
            <Button
              className="accent-tab accent-bg-tab flex items-center gap-2 rounded-md p-1.5 font-bold transition
                       hover:bg-light-primary/10 focus-visible:ring-2 first:focus-visible:ring-[#878a8c] 
                       dark:hover:bg-dark-primary/10 dark:focus-visible:ring-white"
              onClick={xSettingsModal.show}
            >
              <HeroIcon className="w-5 h-5" iconName="Cog8ToothIcon" />
              xSettings
            </Button>
            <Button
              className="accent-tab accent-bg-tab flex items-center gap-2 rounded-md p-1.5 font-bold transition
                       hover:bg-light-primary/10 focus-visible:ring-2 first:focus-visible:ring-[#878a8c] 
                       dark:hover:bg-dark-primary/10 dark:focus-visible:ring-white"
              onClick={displayOpenModal}
            >
              <HeroIcon className="w-5 h-5" iconName="PaintBrushIcon" />
              Display
            </Button>
            <Button
              className="accent-tab accent-bg-tab flex items-center gap-2 rounded-md p-1.5 font-bold transition
                       hover:bg-light-primary/10 focus-visible:ring-2 first:focus-visible:ring-[#878a8c] 
                       dark:hover:bg-dark-primary/10 dark:focus-visible:ring-white"
              onClick={disconnectModal.show}
            >
              <HeroIcon
                className="w-5 h-5"
                iconName="ArrowRightOnRectangleIcon"
              />
              Disconnect
            </Button>
          </nav>
        </div>
      </section>
    </>
  );
}

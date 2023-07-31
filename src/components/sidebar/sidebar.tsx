import Link from "next/link";
import { useModal } from "@/lib/hooks/useModal";
import { Modal } from "@/components/modal/modal";
import { CustomIcon, IconName } from "@/components/ui/custom-icon";
import { Button } from "@/components/ui/button";
import { SidebarLink } from "./sidebar-link";
import { MoreSettings } from "./more-settings";
import { useAccountCharacter, useAccountState } from "@crossbell/connect-kit";
import { Input } from "../input/input";
import { useShowNotificationModal } from "@crossbell/notification";
import cn from "clsx";
import { Tooltip } from 'react-tooltip'


export type NavLink = {
  href: string;
  linkName: string;
  iconName: IconName;
  disabled?: boolean;
  canBeHidden?: boolean;
  onClick?: () => void;
};

export function Sidebar(): JSX.Element {
  const showNotificationModal = useShowNotificationModal();
  const { open, openModal, closeModal } = useModal();
  const currentCharacter = useAccountCharacter();
  const [isConnected] = useAccountState(({ computed }) => [!!computed.account]);

  const navLinks: NavLink[] = [
    {
      href: "/home",
      linkName: "Home",
      iconName: "HomeIcon",
    },
    {
      href: "/explore",
      linkName: "Explore",
      iconName: "ExploreIcon",
      canBeHidden: true,
    },
  ];

  if (isConnected) {
    navLinks.push(
      {
        href: "#",
        linkName: "Notifications",
        iconName: "NotificationIcon",
        onClick: () => showNotificationModal(),
        canBeHidden: true,
      },
      {
        href: "/bookmarks",
        linkName: "Bookmarks",
        iconName: "BookmarkIcon",
      },
      {
        href: "/treasures",
        linkName: "Treasures",
        iconName: "TreasureIcon",
      },
      {
        href: "/token",
        linkName: "Token",
        iconName: "WalletIcon",
        canBeHidden: true,
      }
    );
  }

  return (
    <header
      id="sidebar"
      className="flex w-0 shrink-0 transition-opacity duration-200 xs:w-20 md:w-24 lg:max-w-none xl:-mr-4 xl:w-full xl:max-w-xs xl:justify-end"
    >
      <Modal
        className="flex items-start justify-center"
        modalClassName="bg-main-background rounded-2xl max-w-xl w-full mt-8 overflow-hidden"
        open={open}
        closeModal={closeModal}
      >
        <Input modal closeModal={closeModal} />
      </Modal>
      <div className="fixed bottom-0 z-10 flex w-full flex-col justify-between border-t border-light-border bg-main-background py-0 dark:border-dark-border xs:top-0 xs:h-full xs:w-auto xs:border-0 xs:bg-transparent xs:px-2 xs:py-3 xs:pt-2 md:px-4 xl:w-72">
        <section className="flex flex-col justify-center gap-2 xs:items-center xl:items-stretch">
          <h1 className="hidden xs:flex">
            <Link href="/" className="custom-button main-tab transition">
              <CustomIcon className="h-7 w-7" iconName="ForRealIcon" />
            </Link>
          </h1>
          <div className="transition-all">
            <nav
              className={cn(
                "flex items-center justify-around xs:flex-col xs:justify-center xl:block",
                open && "max-[500px]:hidden"
              )}
            >
              {navLinks.map(({ ...linkData }) => (
                <SidebarLink {...linkData} key={linkData.linkName} />
              ))}
              {isConnected && (
                <SidebarLink
                  href={`/user/${currentCharacter?.handle}`}
                  username="username"
                  linkName="Profile"
                  iconName="UserIcon"
                />
              )}
            </nav>
            <div className="hidden min-[500px]:block">
              <MoreSettings />
            </div>
          </div>
        </section>
        {isConnected && (
          <Button
          className="accent-tab absolute right-4 flex h-[49px] w-[49px] -translate-y-[72px] items-center
                    justify-center rounded-[20px] bg-main-accent text-lg font-bold
                    outline-none transition hover:brightness-90 
                    active:brightness-75 xs:static xs:translate-y-0 xs:hover:bg-main-accent/90 xs:active:bg-main-accent/75"
          onClick={openModal}

          data-tooltip-id="my-tooltip"
          data-tooltip-content="4Real Quick Post"
          data-tooltip-place="top"
        >
          <CustomIcon className="block h-3 w-3" iconName="PlusIcon" />
          <Tooltip id="my-tooltip" />
        </Button>
        )}
      </div>
    </header>
  );
}

import cn from "clsx";
import { Popover } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { preventBubbling } from "@/lib/utils";
import { siteURL } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { HeroIcon } from "@/components/ui/hero-icon";
import { ToolTip } from "@/components/ui/tooltip";
import { variants } from "@/components/tweet/tweet-actions";
import {
  FacebookIcon,
  RedditIcon,
  TelegramIcon,
  TwitterIcon,
  FacebookShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
} from "react-share";

type UserShareProps = {
  username: string;
};

export function UserShare({ username }: UserShareProps): JSX.Element {
  const handleCopy = (closeMenu: () => void) => async (): Promise<void> => {
    closeMenu();
    await navigator.clipboard.writeText(`${siteURL}/user/${username}`);
    toast.success("Copied to clipboard");
  };

  return (
    <Popover className="relative">
      {({ open, close }): JSX.Element => (
        <>
          <Popover.Button
            as={Button}
            className={cn(
              `dark-bg-tab group relative border border-light-line-reply p-2
               hover:bg-light-primary/10 active:bg-light-primary/20 dark:border-light-secondary
               dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20`,
              open && "bg-light-primary/10 dark:bg-dark-primary/10"
            )}
          >
            <HeroIcon className="h-5 w-5" iconName="EllipsisHorizontalIcon" />
            {!open && <ToolTip tip="More" />}
          </Popover.Button>
          <AnimatePresence>
            {open && (
              <Popover.Panel
                className="menu-container group absolute right-0 top-11 whitespace-nowrap text-light-primary dark:text-dark-primary"
                as={motion.div}
                {...variants}
                static
              >
                <Popover.Button
                  className="accent-tab flex w-full gap-3 rounded-md rounded-b-none border-b border-light-border p-4 hover:bg-main-sidebar-background dark:border-dark-border"
                  as={Button}
                  onClick={preventBubbling(close)}
                >
                  <FacebookShareButton url={`${siteURL}/user/${username}`}>
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <TwitterShareButton url={`${siteURL}/user/${username}`}>
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                  <TelegramShareButton url={`${siteURL}/user/${username}`}>
                    <TelegramIcon size={32} round />
                  </TelegramShareButton>
                  <RedditShareButton url={`${siteURL}/user/${username}`}>
                    <RedditIcon size={32} round />
                  </RedditShareButton>
                </Popover.Button>
                <Popover.Button
                  className="flex w-full gap-3 rounded-md rounded-b-none p-4 hover:bg-main-sidebar-background"
                  as={Button}
                  onClick={preventBubbling(handleCopy(close))}
                >
                  <HeroIcon iconName="LinkIcon" />
                  Copy link to Profile
                </Popover.Button>
              </Popover.Panel>
            )}
          </AnimatePresence>
        </>
      )}
    </Popover>
  );
}

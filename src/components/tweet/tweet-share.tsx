import cn from "clsx";
import { Popover } from "@headlessui/react";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { preventBubbling } from "@/lib/utils";
import { siteURL } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { HeroIcon } from "@/components/ui/hero-icon";
import { ToolTip } from "@/components/ui/tooltip";
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

type TweetShareProps = {
  tweetId: string;
  viewTweet?: boolean;
};

export const variants: Variants = {
  initial: { opacity: 0, y: -25 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", duration: 0.4 },
  },
  exit: { opacity: 0, y: -25, transition: { duration: 0.2 } },
};

export function TweetShare({
  tweetId,
  viewTweet,
}: TweetShareProps): JSX.Element {
  const handleCopy = (closeMenu: () => void) => async (): Promise<void> => {
    closeMenu();
    await navigator.clipboard.writeText(`${siteURL}/post/${tweetId}`);
    toast.success("Copied to clipboard");
  };

  return (
    <Popover className="relative">
      {({ open, close }): JSX.Element => (
        <>
          <Popover.Button
            className={cn(
              `group relative flex items-center gap-1 p-0 outline-none 
               transition-none hover:text-accent-blue focus-visible:text-accent-blue`,
              open && "text-accent-blue inner:bg-accent-blue/10"
            )}
          >
            <i className="relative p-2 not-italic duration-200 rounded-full group-hover:bg-accent-blue/10 group-focus-visible:bg-accent-blue/10 group-focus-visible:ring-2 group-focus-visible:ring-accent-blue/80 group-active:bg-accent-blue/20">
              <HeroIcon
                className={viewTweet ? "h-6 w-6" : "h-5 w-5"}
                iconName="ArrowUpTrayIcon"
              />
              {!open && <ToolTip tip="Share" />}
            </i>
          </Popover.Button>
          <AnimatePresence>
            {open && (
              <Popover.Panel
                className="absolute right-0 menu-container group top-11 whitespace-nowrap text-light-primary dark:text-dark-primary"
                as={motion.div}
                {...variants}
                static
              >
                <Popover.Button
                  className="flex w-full gap-3 p-4 border-b rounded-md rounded-b-none accent-tab border-light-border hover:bg-main-sidebar-background dark:border-dark-border"
                  as={Button}
                  onClick={preventBubbling(close)}
                >
                  <FacebookShareButton url={`${siteURL}/post/${tweetId}`}>
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <TwitterShareButton url={`${siteURL}/post/${tweetId}`}>
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                  <TelegramShareButton url={`${siteURL}/post/${tweetId}`}>
                    <TelegramIcon size={32} round />
                  </TelegramShareButton>
                  <RedditShareButton url={`${siteURL}/post/${tweetId}`}>
                    <RedditIcon size={32} round />
                  </RedditShareButton>
                </Popover.Button>
                <Popover.Button
                  className="flex w-full gap-3 p-4 rounded-md rounded-b-none accent-tab hover:bg-main-sidebar-background"
                  as={Button}
                  onClick={preventBubbling(handleCopy(close))}
                >
                  <HeroIcon iconName="LinkIcon" />
                  Copy link to share your 4Real post
                </Popover.Button>
              </Popover.Panel>
            )}
          </AnimatePresence>
        </>
      )}
    </Popover>
  );
}

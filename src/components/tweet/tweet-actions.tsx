import { useRouter } from "next/router";
import { Popover } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import cn from "clsx";
import { toast } from "react-hot-toast";
import { useModal } from "@/lib/hooks/useModal";
import { delayScroll, preventBubbling, sleep } from "@/lib/utils";
import { Modal } from "@/components/modal/modal";
import { ActionModal } from "@/components/modal/action-modal";
import { Button } from "@/components/ui/button";
import { ToolTip } from "@/components/ui/tooltip";
import { HeroIcon } from "@/components/ui/hero-icon";
import type { Variants } from "framer-motion";
import type { NoteEntity } from "crossbell";
import {
  useAccountCharacter,
  useDeleteNote,
  useFollowCharacter,
  useUnfollowCharacter,
  useUpdateCharacterMetadata,
} from "@crossbell/connect-kit";
import { useNoteCharacter } from "@/lib/hooks/useNoteCharacter";
import {
  useNote,
  useCharacterFollowRelation,
  useNotesOfCharacter,
} from "@crossbell/indexer";
import { extractCharacterName } from "@crossbell/util-metadata";
import { CustomIcon } from "../ui/custom-icon";
import { usePagesOfCharacter } from "@/query/page";

export const variants: Variants = {
  initial: { opacity: 0, y: -25 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", duration: 0.4 },
  },
  exit: { opacity: 0, y: -25, transition: { duration: 0.2 } },
};

type TweetActionsProps = {
  tweet: NoteEntity;
  viewTweet?: boolean;
  page?: boolean;
};

export function TweetActions({
  tweet,
  viewTweet,
  page,
}: TweetActionsProps): JSX.Element {
  const { push } = useRouter();
  const currentCharacter = useAccountCharacter();
  const { character } = useNoteCharacter(tweet);
  const { data } = useNote(tweet.characterId, tweet.noteId);
  const deleteNote = useDeleteNote();
  const { data: followRelation, isLoadingFollowRelation } =
    useCharacterFollowRelation(
      currentCharacter?.characterId,
      character?.characterId
    );

  const follow = useFollowCharacter();
  const unfollow = useUnfollowCharacter();

  const updateCharacterMetadata = useUpdateCharacterMetadata();

  const { refetch } = useNotesOfCharacter(character?.characterId);
  const { refetch: refetchPage } = usePagesOfCharacter(
    currentCharacter?.characterId
  );

  const {
    open: removeOpen,
    openModal: removeOpenModal,
    closeModal: removeCloseModal,
  } = useModal();

  const {
    open: unfollowOpen,
    openModal: unfollowOpenModal,
    closeModal: unfollowCloseModal,
  } = useModal();

  const {
    open: pinOpen,
    openModal: pinOpenModal,
    closeModal: pinCloseModal,
  } = useModal();

  const handleRemove = async (): Promise<void> => {
    deleteNote.mutate(tweet, {
      onSuccess: async () => {
        if (!viewTweet) return;
        if (!!tweet.toNote && data) {
          await push(`/post/${tweet.characterId}-${tweet.noteId}`, undefined, {
            scroll: false,
          });
          delayScroll(200)();
          await sleep(50);
        } else await push("/home");
        toast.success(`Your post was deleted`);
        if (page) refetchPage();
        else refetch();
        removeCloseModal();
      },
    });
  };

  const handlePin = async (): Promise<void> => {
    if (!currentCharacter) return;
    updateCharacterMetadata.mutate(
      {
        characterId: currentCharacter?.characterId,
        edit(metadataDraft) {
          const newAttribute: {
            trait_type: string;
            value: string;
          } = {
            trait_type: "4real_pinned_tweet",
            value: `${tweet.characterId}-${tweet.noteId}`,
          };
          if (!metadataDraft.attributes) {
            metadataDraft.attributes = [newAttribute];
          } else {
            const oldAttribute = metadataDraft.attributes.find(
              (attr) => attr.trait_type === newAttribute.trait_type
            );
            if (oldAttribute) {
              oldAttribute.value = newAttribute.value;
            } else {
              metadataDraft.attributes.push(newAttribute);
            }
          }
        },
      },
      {
        onSuccess: () => {
          toast.success(`Your post was pinned`);
          pinCloseModal();
        },
      }
    );
  };

  const toggleFollow = async (closeMenu: () => void): Promise<void> => {
    if (followRelation?.isFollowing) {
      unfollowOpenModal();
    } else {
      follow.mutate(character!, {
        onSuccess: () => toast.success(`You followed @${character?.handle}`),
      });
    }
    sleep(1000).then(closeMenu);
  };

  const handleUnpin = async (): Promise<void> => {
    if (!currentCharacter) return;
    updateCharacterMetadata.mutate(
      {
        characterId: currentCharacter?.characterId,
        edit(metadataDraft) {
          if (!metadataDraft.attributes) return;
          metadataDraft.attributes = metadataDraft.attributes.filter(
            (attr) => attr.trait_type !== "4real_pinned_tweet"
          );
        },
      },
      {
        onSuccess: () => {
          toast.success(`Your post was unpinned`);
          refetch();
        },
      }
    );
  };

  const pinned = character?.metadata?.content?.attributes?.find(
    (attr) => attr.trait_type === "4real_pinned_tweet"
  )?.value as string;
  const isPinned = pinned === `${tweet.characterId}-${tweet.noteId}`;
  const isOwner = currentCharacter?.characterId === tweet.characterId;

  return (
    <>
      <Modal
        modalClassName="flex flex-col gap-6 max-w-xs bg-main-background w-full p-8 rounded-2xl"
        open={unfollowOpen}
        closeModal={unfollowCloseModal}
      >
        <ActionModal
          title={`Unfollow @${extractCharacterName(character)}?`}
          description="Their posts will no longer show up in your home timeline. You can still view their profile, unless their posts are hidden."
          mainBtnLabel="Unfollow"
          action={() =>
            unfollow.mutate(character!, {
              onSuccess: () => {
                unfollowCloseModal();
                toast.success(`You unfollowed @${character?.handle}`);
              },
            })
          }
          closeModal={unfollowCloseModal}
        />
      </Modal>
      <Modal
        modalClassName="max-w-xs bg-main-background w-full p-8 rounded-2xl"
        open={removeOpen}
        closeModal={removeCloseModal}
      >
        <ActionModal
          title="Delete post?"
          description={`This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from 4Real search results.`}
          mainBtnClassName="bg-accent-red hover:bg-accent-red/90 active:bg-accent-red/75 accent-tab
                            focus-visible:bg-accent-red/90"
          mainBtnLabel="Delete"
          focusOnMainBtn
          action={handleRemove}
          closeModal={removeCloseModal}
        />
      </Modal>
      <Modal
        modalClassName="max-w-xs bg-main-background w-full p-8 rounded-2xl"
        open={pinOpen}
        closeModal={pinCloseModal}
      >
        <ActionModal
          title="Pin post?"
          description={`You can pin one post to the top of your timeline. This operation will overwrite your previous pinned post.`}
          mainBtnClassName="bg-main-accent hover:bg-main-accent/90 active:bg-main-accent/75 accent-tab
                            focus-visible:bg-main-accent/90"
          mainBtnLabel="Pin"
          focusOnMainBtn
          action={handlePin}
          closeModal={pinCloseModal}
        />
      </Modal>
      <Popover>
        {({ open, close }): JSX.Element => (
          <>
            <Popover.Button
              as={Button}
              className={cn(
                `main-tab group group absolute right-2 top-2 p-2 
                 hover:bg-accent-blue/10 focus-visible:bg-accent-blue/10
                 focus-visible:!ring-accent-blue/80 active:bg-accent-blue/20`,
                open && "bg-accent-blue/10 [&>div>svg]:text-accent-blue"
              )}
              disabled={isLoadingFollowRelation}
            >
              <div className="relative group">
                <HeroIcon
                  className="w-5 h-5 text-light-secondary group-hover:text-accent-blue group-focus-visible:text-accent-blue dark:text-dark-secondary/80"
                  iconName="EllipsisHorizontalIcon"
                />
                {!open && <ToolTip tip="More" />}
              </div>
            </Popover.Button>
            <AnimatePresence>
              {open && (
                <Popover.Panel
                  className="menu-container group absolute right-2 top-[50px] whitespace-nowrap text-light-primary 
                             dark:text-dark-primary"
                  as={motion.div}
                  {...variants}
                  static
                >
                  {isOwner ? (
                    <>
                      {page ? null : !isPinned ? (
                        <Popover.Button
                          className="flex w-full gap-3 p-4 rounded-md rounded-b-none accent-tab hover:bg-main-sidebar-background"
                          as={Button}
                          onClick={preventBubbling(pinOpenModal)}
                        >
                          <CustomIcon iconName="PinIcon" />
                          Pin
                        </Popover.Button>
                      ) : (
                        <Popover.Button
                          className="flex w-full gap-3 p-4 rounded-md rounded-b-none accent-tab text-accent-red hover:bg-main-sidebar-background"
                          as={Button}
                          onClick={preventBubbling(handleUnpin)}
                        >
                          <CustomIcon iconName="PinOffIcon" />
                          Unpin
                        </Popover.Button>
                      )}
                      <Popover.Button
                        className="flex w-full gap-3 p-4 rounded-md rounded-b-none accent-tab text-accent-red hover:bg-main-sidebar-background"
                        as={Button}
                        onClick={preventBubbling(removeOpenModal)}
                      >
                        <HeroIcon iconName="TrashIcon" />
                        Delete
                      </Popover.Button>
                    </>
                  ) : (
                    <Popover.Button
                      className="flex w-full gap-3 p-4 rounded-md rounded-t-none accent-tab hover:bg-main-sidebar-background"
                      as={Button}
                      onClick={preventBubbling(() => {
                        toggleFollow(close);
                      })}
                    >
                      <HeroIcon
                        iconName={
                          followRelation?.isFollowing
                            ? "UserMinusIcon"
                            : "UserPlusIcon"
                        }
                      />
                      {followRelation?.isFollowing ? "Unfollow" : "Follow"} @
                      {character?.handle}
                    </Popover.Button>
                  )}
                </Popover.Panel>
              )}
            </AnimatePresence>
          </>
        )}
      </Popover>
    </>
  );
}

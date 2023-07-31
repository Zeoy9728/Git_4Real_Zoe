import { useModal } from "@/lib/hooks/useModal";
import { preventBubbling } from "@/lib/utils";
import { Modal } from "@/components/modal/modal";
import { ActionModal } from "@/components/modal/action-modal";
import { Button } from "@/components/ui/button";
import type { CharacterEntity } from "crossbell";
import {
  useAccountCharacter,
  useFollowCharacter,
  useUnfollowCharacter,
} from "@crossbell/connect-kit";
import { useCharacterFollowRelation } from "@crossbell/indexer";
import { extractCharacterName } from "@crossbell/util-metadata";

type FollowButtonProps = {
  character: CharacterEntity;
};

export function FollowButton({
  character,
}: FollowButtonProps): JSX.Element | null {
  const { open, openModal, closeModal } = useModal();
  const currentCharacter = useAccountCharacter();
  const { data: followRelation } = useCharacterFollowRelation(
    currentCharacter?.characterId,
    character?.characterId
  );

  const follow = useFollowCharacter();
  const unfollow = useUnfollowCharacter();

  const userIsFollowed = followRelation?.isFollowing;

  if (character.characterId === currentCharacter?.characterId) return null;

  return (
    <>
      <Modal
        modalClassName="flex flex-col gap-6 max-w-xs bg-main-background w-full p-8 rounded-2xl"
        open={open}
        closeModal={closeModal}
      >
        <ActionModal
          title={`Unfollow @${extractCharacterName(character)}?`}
          description="Their posts will no longer show up in your home timeline. You can still view their profile, unless their posts are hidden."
          mainBtnLabel="Unfollow"
          action={() =>
            unfollow.mutate(character, {
              onSuccess: () => closeModal(),
            })
          }
          closeModal={closeModal}
        />
      </Modal>
      {userIsFollowed ? (
        <Button
          className='dark-bg-tab min-w-[106px] self-start border border-light-line-reply px-4 py-1.5 
                     font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red
                     hover:before:content-["Unfollow"] inner:hover:hidden dark:border-light-secondary'
          onClick={preventBubbling(openModal)}
        >
          <span>Following</span>
        </Button>
      ) : (
        <Button
          className="self-start border bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90 
                     focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border 
                     dark:text-light-primary dark:hover:bg-light-border/90 dark:focus-visible:bg-light-border/90 
                     dark:active:bg-light-border/75"
          onClick={preventBubbling(() => follow.mutate(character))}
        >
          Follow
        </Button>
      )}
    </>
  );
}

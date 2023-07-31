import cn from "clsx";
import { Button } from "@/components/ui/button";
import { NoteEntity } from "crossbell";
import { CharacterAvatar } from "@crossbell/ui";
import { useCharacter } from "@crossbell/indexer";
import { Loading } from "../ui/loading";
import { extractCharacterName } from "@crossbell/util-metadata";
import Link from "next/link";
import { miraLink } from "@/lib/env";
import { useState } from "react";
import {
  useAccountMiraBalance,
  useConnectModal,
  useTip,
  useTipList,
} from "@crossbell/connect-kit";
import { CustomIcon } from "../ui/custom-icon";
import { useDecrypt } from "@/query/encrypt";

type PatronModalProps = {
  tweet: NoteEntity;
  closeModal: () => void;
};

const MIRA_OPTIONS = [1, 5, 10];

export function PatronModal({
  tweet,
  closeModal,
}: PatronModalProps): JSX.Element {
  const [amount, setAmount] = useState(1);
  const { data: character, isLoading } = useCharacter(tweet.characterId);
  const { balance } = useAccountMiraBalance();
  const { refetch: decryptRefetch } = useDecrypt();
  const { refetch } = useTipList({
    toCharacterId: tweet.characterId,
    toNoteId: tweet.noteId,
  });

  const connectModal = useConnectModal();
  const tip = useTip({
    onSuccess: () => {
      closeModal();
      refetch();
      decryptRefetch();
    },
  });

  if (isLoading) {
    return <Loading className="flex items-center justify-center p-4 h-52" />;
  }

  const characterName = extractCharacterName(character);

  const submit = () => {
    if (tweet?.characterId && amount > 0) {
      tip.mutate({
        characterId: tweet?.characterId,
        amount: amount,
        noteId: tweet?.noteId,
      });
    } else {
      closeModal();
      connectModal.show();
    }
  };

  return (
    <div className="flex flex-col items-center w-full gap-6 py-6">
      <CharacterAvatar character={character} size={100} />
      <div>
        <p className="text-sm text-center text-main-secondary">
          Your tips will help to spread the note
        </p>
        <p className="font-bold text-center">{characterName}</p>
      </div>
      <div className="grid w-full grid-cols-4 gap-2">
        {MIRA_OPTIONS.map((option) => (
          <button
            key={option}
            className={cn(
              "flex items-center justify-center h-32 font-bold border rounded-2xl border-light-border dark:border-dark-border",
              option === amount &&
                "border-main-accent/75 dark:border-main-accent/75"
            )}
            onClick={() => setAmount(option)}
          >
            {option} MIRA
          </button>
        ))}
        <div
          key={"custom"}
          className={cn(
            "flex items-center justify-center h-32 font-bold border rounded-2xl border-light-border dark:border-dark-border"
          )}
        >
          <input
            placeholder="Custom"
            type="number"
            className={cn(
              "w-full text-center bg-transparent outline-none",
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            )}
            onChange={(e) => setAmount(parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between w-full gap-4">
        <span className="text-main-secondary">My Balance:</span>
        <div className="flex flex-row items-center gap-1">
          <CustomIcon className="w-4 h-4" iconName="MiraIcon" />
          {balance ? (
            <span className="font-bold">{balance.formatted} MIRA</span>
          ) : (
            <span className="font-bold">0 MIRA</span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Button
          className="accent-tab bg-main-accent px-4 py-1.5 font-bold text-white
                     hover:bg-main-accent/90
                     active:bg-main-accent/75"
          onClick={() => {
            submit();
          }}
        >
          {"Confirm"}
        </Button>
        <Link href={miraLink}>
          <span className="text-sm text-center text-main-secondary">
            What is MIRA? Where can I get some?
          </span>
        </Link>
      </div>
    </div>
  );
}

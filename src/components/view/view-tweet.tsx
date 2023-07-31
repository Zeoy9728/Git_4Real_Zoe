import Link from "next/link";
import { motion } from "framer-motion";
import cn from "clsx";
import { useModal } from "@/lib/hooks/useModal";
import { Modal } from "@/components/modal/modal";
import { TweetReplyModal } from "@/components/modal/tweet-reply-modal";
import { ImagePreview } from "@/components/input/image-preview";
import { UserTooltip } from "@/components/user/user-tooltip";
import { UserName } from "@/components/user/user-name";
import { UserUsername } from "@/components/user/user-username";
import { variants } from "@/components/tweet/tweet";
import { TweetActions } from "@/components/tweet/tweet-actions";
import { TweetStats } from "@/components/tweet/tweet-stats";
import { TweetDate } from "@/components/tweet/tweet-date";
import { Input } from "@/components/input/input";
import { RefObject, useEffect, useState } from "react";
import { CharacterAvatar } from "@crossbell/ui";
import { useNoteCharacter } from "@/lib/hooks/useNoteCharacter";
import { extractCharacterName } from "@crossbell/util-metadata";
import type { NoteEntity, NoteMetadata } from "crossbell";
import dynamic from "next/dynamic";
import VideoPreview from "../input/video-preview";
import { useDecrypt } from "@/query/encrypt";
import { decryptText } from "@/lib/encrypt";
import EncryptPreview from "../input/encrypt-preview";
import { ipfsLinkToHttpLink } from "@/lib/ipfs";
import { Markdown } from "../rehype/markdown";
import { PatronModal } from "../modal/patron-modal";

const AudioPreview = dynamic(() => import("../input/audio-preview"), {
  ssr: false,
});

type ViewTweetProps = {
  tweet: NoteEntity;
} & {
  viewTweetRef?: RefObject<HTMLElement>;
  page?: boolean;
};

export function ViewTweet({
  tweet,
  viewTweetRef,
  page,
}: ViewTweetProps): JSX.Element {
  const { character } = useNoteCharacter(tweet);
  const { character: parentCharacter } = useNoteCharacter(tweet.toNote);
  const { data, isLoading } = useDecrypt();

  const { open, openModal, closeModal } = useModal();
  const {
    open: patronOpen,
    openModal: openPatronModal,
    closeModal: closePatronModal,
  } = useModal();

  const { characterId, noteId } = tweet;

  const tweetLink = `/post/${characterId}-${noteId}`;
  const reply = !!tweet.toNote;

  const content = tweet.metadata?.content as NoteMetadata & {
    secret?: string;
    iv?: string;
    protected_media?: string;
  };

  const [text, setText] = useState(tweet.metadata?.content?.content ?? "");
  const [attachments, setAttachments] = useState(content?.attachments);

  let type = "text";
  if (attachments && attachments.length > 0 && attachments[0].mime_type) {
    type = attachments[0].mime_type.split("/")[0];
  }

  if (content.secret && !attachments) {
    type = "encrypted";
  }

  useEffect(() => {
    if (isLoading) return;
    if (!data) return;
    if (!data.message?.[`${characterId}-${noteId}`]) {
      setAttachments(content?.attachments);
    } else {
      const aesKey = data.message[`${characterId}-${noteId}`] ?? "";
      const iv = content?.iv ?? "";
      const ciphertext = content?.protected_media ?? "";

      decryptText(aesKey, iv, ciphertext)
        .then((text) => {
          const obj = JSON.parse(text);
          const attachments =
            obj?.filter((a: any) => a.mime_type !== "text/plain") ?? [];
          const fullText = obj?.find(
            (a: any) => a.mime_type === "text/plain"
          ).alt;
          setText(fullText ? fullText : tweet.metadata?.content?.content ?? "");
          setAttachments(attachments);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [
    characterId,
    content?.attachments,
    content?.iv,
    content?.protected_media,
    data,
    isLoading,
    noteId,
    tweet.metadata?.content?.content,
  ]);

  return (
    <motion.article
      className={cn(
        `accent-tab relative flex cursor-default flex-col gap-3 
         border-light-border px-4 py-3 outline-none dark:border-dark-border`,
        reply && "scroll-m-[3.25rem] pt-0",
        !page && "border-b"
      )}
      {...variants}
      animate={{ ...variants.animate, transition: { duration: 0.2 } }}
      exit={undefined}
      ref={viewTweetRef}
    >
      <Modal
        className="flex items-start justify-center"
        modalClassName="bg-main-background rounded-2xl max-w-xl w-full mt-8 overflow-hidden"
        open={open}
        closeModal={closeModal}
      >
        <TweetReplyModal
          tweet={tweet}
          closeModal={closeModal}
          username={""}
          handle={""}
        />
      </Modal>
      <Modal
        modalClassName="max-w-md bg-main-background w-full p-8 rounded-2xl"
        open={patronOpen}
        closeModal={closePatronModal}
      >
        <PatronModal tweet={tweet} closeModal={closePatronModal} />
      </Modal>
      <div className="flex flex-col gap-2">
        {reply && (
          <div className="flex items-center justify-center w-12">
            <i className="hover-animation h-2 w-0.5 bg-light-line-reply dark:bg-dark-line-reply" />
          </div>
        )}
        <div className="grid grid-cols-[auto,1fr] gap-3">
          <UserTooltip character={character!}>
            <CharacterAvatar size={48} characterId={tweet.characterId} />
          </UserTooltip>
          <div className="flex justify-between min-w-0">
            <div className="flex flex-col truncate xs:overflow-visible xs:whitespace-normal">
              <UserTooltip character={character!}>
                <UserName
                  className="-mb-1"
                  name={extractCharacterName(character)}
                  username={character?.handle}
                  verified={false}
                />
              </UserTooltip>
              <UserTooltip character={character!}>
                <UserUsername username={character?.handle!} />
              </UserTooltip>
            </div>
            <div className="px-4">
              <TweetActions page tweet={tweet} />
            </div>
          </div>
        </div>
      </div>
      {reply && (
        <p className="text-light-secondary dark:text-dark-secondary">
          Replying to{" "}
          <Link
            href={`/user/${parentCharacter?.handle}`}
            className="custom-underline text-main-accent"
          >
            @{extractCharacterName(parentCharacter)}
          </Link>
        </p>
      )}
      <div>
        {text && (
          <div className="overflow-hidden text-xl break-words">
            <Markdown previewLink={false} content={text} />
          </div>
        )}
        {type === "image" && attachments && attachments.length > 0 && (
          <ImagePreview
            tweet
            imagesPreview={attachments.map(
              (image: { address?: string; alt?: string }) => ({
                id: image.address ?? "",
                src: ipfsLinkToHttpLink(image.address ?? ""),
                alt: image.alt ?? "",
              })
            )}
            previewCount={attachments.length!}
          />
        )}
        {type === "audio" && (
          <AudioPreview
            tweet
            audioPreview={ipfsLinkToHttpLink(
              attachments?.find((item: any) =>
                item.mime_type?.includes("audio")
              )?.address ?? ""
            )}
          />
        )}
        {type === "video" && (
          <VideoPreview
            tweet
            videoPreview={ipfsLinkToHttpLink(
              attachments?.find((item: any) =>
                item.mime_type?.includes("video")
              )?.address ?? ""
            )}
          />
        )}
        {type === "encrypted" && <EncryptPreview tweet={tweet} />}
        {!page && (
          <>
            <div className="inner:hover-animation inner:border-b inner:border-light-border dark:inner:border-dark-border">
              <TweetDate
                viewTweet
                tweetLink={tweetLink}
                createdAt={tweet.createdAt}
              />
              <TweetStats
                viewTweet
                tweet={tweet}
                openModal={openModal}
                openPatronModal={openPatronModal}
              />
            </div>
            <Input
              reply
              parent={{
                username: extractCharacterName(character),
                handle: character?.handle!,
                characterId: character?.characterId!,
                noteId: tweet.noteId,
              }}
            />
          </>
        )}
      </div>
    </motion.article>
  );
}

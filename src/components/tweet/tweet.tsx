import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import cn from "clsx";
import { useModal } from "@/lib/hooks/useModal";
import { delayScroll } from "@/lib/utils";
import { Modal } from "@/components/modal/modal";
import { TweetReplyModal } from "@/components/modal/tweet-reply-modal";
import { UserTooltip } from "@/components/user/user-tooltip";
import { UserName } from "@/components/user/user-name";
import { UserUsername } from "@/components/user/user-username";
import { TweetActions } from "./tweet-actions";
import { TweetStats } from "./tweet-stats";
import { TweetDate } from "./tweet-date";
import type { Variants } from "framer-motion";
import { CharacterAvatar } from "@crossbell/ui";
import { NoteEntity, NoteMetadata } from "crossbell";
import { extractCharacterName } from "@crossbell/util-metadata";
import { useNoteCharacter } from "@/lib/hooks/useNoteCharacter";
import { ImagePreview } from "../input/image-preview";
import dynamic from "next/dynamic";
import VideoPreview from "../input/video-preview";
import EncryptPreview from "../input/encrypt-preview";
import { useEffect, useState } from "react";
import { useDecrypt } from "@/query/encrypt";
import { decryptText } from "@/lib/encrypt";
import { ipfsLinkToHttpLink } from "@/lib/ipfs";
import { Markdown } from "../rehype/markdown";
import { TweetStatus } from "./tweet-status";
import { PatronModal } from "../modal/patron-modal";

const AudioPreview = dynamic(() => import("../input/audio-preview"), {
  ssr: false,
});

export type TweetProps = NoteEntity & {
  secret?: string;
  parentTweet?: boolean;
  pinned?: boolean;
  modal?: boolean;
  parent?: {
    username: string;
    handle: string;
  };
};

export const variants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.8 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export function Tweet(tweet: TweetProps): JSX.Element {
  const { characterId, noteId, createdAt, modal, pinned, parentTweet, parent } =
    tweet;
  const { character } = useNoteCharacter(tweet);
  const { data, isLoading } = useDecrypt();

  const { open, openModal, closeModal } = useModal();
  const {
    open: patronOpen,
    openModal: openPatronModal,
    closeModal: closePatronModal,
  } = useModal();

  const tweetLink = `/post/${characterId}-${noteId}`;
  const reply = !!parent;

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
      {...(!modal ? { ...variants, layout: "position" } : {})}
      animate={{
        ...variants.animate,
        ...(parentTweet && { transition: { duration: 0.2 } }),
      }}
    >
      <Modal
        className="flex items-start justify-center"
        modalClassName="bg-main-background rounded-2xl max-w-xl w-full my-8 overflow-hidden"
        open={open}
        closeModal={closeModal}
      >
        <TweetReplyModal
          tweet={tweet}
          username={extractCharacterName(character)}
          handle={character?.handle!}
          closeModal={closeModal}
        />
      </Modal>
      <Modal
        modalClassName="max-w-md bg-main-background w-full p-8 rounded-2xl"
        open={patronOpen}
        closeModal={closePatronModal}
      >
        <PatronModal tweet={tweet} closeModal={closePatronModal} />
      </Modal>
      <Link href={tweetLink} scroll={!reply} legacyBehavior>
        <div
          className={cn(
            `accent-tab hover-card relative flex flex-col 
             gap-y-4 px-4 py-3 outline-none duration-200`,
            parentTweet
              ? "mt-0.5 pb-0 pt-2.5"
              : "border-b border-light-border dark:border-dark-border"
          )}
          onClick={delayScroll(200)}
        >
          <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1">
            <AnimatePresence initial={false}>
              {modal
                ? null
                : pinned && (
                    <TweetStatus type="pin">
                      <p className="text-sm font-bold">Pinned Tweet</p>
                    </TweetStatus>
                  )}
            </AnimatePresence>
            <div className="flex flex-col items-center gap-2">
              <UserTooltip character={character!} modal={modal}>
                <Link href={`/user/${character?.handle}`}>
                  <CharacterAvatar size={48} character={character} />
                </Link>
              </UserTooltip>
              {parentTweet && (
                <i className="hover-animation h-full w-0.5 bg-light-line-reply dark:bg-dark-line-reply" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex justify-between gap-2 text-light-secondary dark:text-dark-secondary">
                <div className="flex gap-1 truncate xs:overflow-visible xs:whitespace-normal">
                  <UserTooltip character={character!} modal={modal}>
                    <UserName
                      name={extractCharacterName(character)}
                      username={character?.handle}
                      verified={false}
                      className="text-light-primary dark:text-dark-primary"
                    />
                  </UserTooltip>
                  <UserTooltip character={character!} modal={modal}>
                    <UserUsername username={character?.handle!} />
                  </UserTooltip>
                  <TweetDate tweetLink={tweetLink} createdAt={createdAt} />
                </div>
                <div className="px-4">
                  {!modal && <TweetActions tweet={tweet} />}
                </div>
              </div>
              {(reply || modal) && (
                <p
                  className={cn(
                    "text-light-secondary dark:text-dark-secondary",
                    modal && "order-1 my-2"
                  )}
                >
                  Replying to{" "}
                  <Link
                    href={`/user/${character?.handle}`}
                    className="custom-underline text-main-accent"
                  >
                    @{extractCharacterName(character)}
                  </Link>
                </p>
              )}
              {text && (
                <div className="overflow-hidden break-words line-clamp-3">
                  <Markdown previewLink={true} content={text} />
                </div>
              )}
              <div className="flex flex-col gap-2 mt-1">
                {type === "image" && attachments && attachments.length > 0 && (
                  <ImagePreview
                    tweet
                    imagesPreview={attachments.map((image: any) => ({
                      id: image.address ?? "",
                      src: image.address
                        ? ipfsLinkToHttpLink(image.address)
                        : "",
                      alt: image.alt ?? "",
                    }))}
                    previewCount={attachments.length!}
                  />
                )}
                {type === "audio" && (
                  <AudioPreview
                    audioPreview={ipfsLinkToHttpLink(
                      attachments?.find((item: any) =>
                        item.mime_type?.includes("audio")
                      )?.address ?? ""
                    )}
                  />
                )}
                {type === "video" && (
                  <VideoPreview
                    videoPreview={ipfsLinkToHttpLink(
                      attachments?.find((item: any) =>
                        item.mime_type?.includes("video")
                      )?.address ?? ""
                    )}
                  />
                )}
                {type === "encrypted" && <EncryptPreview tweet={tweet} />}
                {!modal && (
                  <TweetStats
                    tweet={tweet}
                    openModal={!parent ? openModal : undefined}
                    openPatronModal={openPatronModal}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

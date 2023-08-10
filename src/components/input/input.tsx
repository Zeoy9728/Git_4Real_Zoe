import Link from "next/link";
import { useState, useEffect, useRef, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import cn from "clsx";
import { InputForm, PRICE_LIST, fromTop } from "./input-form";
import { ImagePreview } from "./image-preview";
import { InputOptions } from "./input-options";
import type { ReactNode, FormEvent, ChangeEvent, ClipboardEvent } from "react";
import type { Variants } from "framer-motion";
import {
  useAccountCharacter,
  usePostNote,
  usePostNoteForNote,
} from "@crossbell/connect-kit";
import { CharacterAvatar } from "@crossbell/ui";
import type { FilesWithId, ImageData, PreviewData } from "@/lib/types/file";
import toast from "react-hot-toast";
import { getAudioData, getImagesData, getVideoData } from "@/lib/validation";
import { uploadFiles } from "@/lib/upload-file";
import { useNotes } from "@crossbell/indexer";
import VideoPreview from "./video-preview";
import dynamic from "next/dynamic";
import { encrypt } from "@/lib/encrypt";
import { composeNoteHref } from "@/lib/url-composer";
import { siteName } from "@/lib/env";
import { usePagesOfCharacter } from "@/query/page";

const AudioPreview = dynamic(() => import("../input/audio-preview"), {
  ssr: false,
});

type InputProps = {
  modal?: boolean;
  page?: boolean;
  reply?: boolean;
  parent?: {
    handle: string;
    username: string;
    characterId: number;
    noteId: number;
  };
  disabled?: boolean;
  children?: ReactNode;
  replyModal?: boolean;
  closeModal?: () => void;
};

export const variants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export function Input({
  modal,
  page,
  reply,
  parent,
  disabled,
  children,
  replyModal,
  closeModal,
}: InputProps): JSX.Element {
  const postNote = usePostNote();
  const postNoteForNote = usePostNoteForNote();
  const currentCharacter = useAccountCharacter();
  const { refetch: refetchNote } = useNotes({
    limit: 20,
  });
  const { refetch: refetchPage } = usePagesOfCharacter(
    currentCharacter?.characterId
  );
  const [selectedImages, setSelectedImages] = useState<FilesWithId>([]);
  const [imagesPreview, setImagesPreview] = useState<PreviewData>([]);
  const [selectedAudio, setSelectedAudio] = useState<FilesWithId>([]);
  const [audioPreview, setAudioPreview] = useState<PreviewData>([]);
  const [selectedVideo, setSelectedVideo] = useState<FilesWithId>([]);
  const [videoPreview, setVideoPreview] = useState<PreviewData>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [visited, setVisited] = useState(false);
  const [isNSFW, setIsNSFW] = useState(false);

  // const [price, setPrice] = useState<any>(PRICE_LIST[0]);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const previewCount = imagesPreview.length;
  const isUploadingImages = !!previewCount;

  const type =
    imagesPreview.length > 0
      ? "image"
      : audioPreview.length > 0
      ? "audio"
      : videoPreview.length > 0
      ? "video"
      : "text";

  useEffect(
    () => {
      if (modal) inputRef.current?.focus();
      return cleanImage;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const sendTweet = async (price?: number): Promise<void> => {
    inputRef.current?.blur();

    // one hundred means one MIRA
    const lock = !!price;

    setLoading(true);
    const rawFiles =
      type === "image"
        ? selectedImages
        : type === "audio"
        ? selectedAudio
        : type === "video"
        ? selectedVideo
        : [];
    let attachments = (await uploadFiles(rawFiles)) || [];
    const encrypted = await encrypt(JSON.stringify(attachments || []).trim());

    if (lock && !attachments) {
      attachments = [
        {
          alt: inputValue.trim(),
          mime_type: "text/plain",
          name: "text",
          size_in_bytes: inputValue.length,
        },
      ];
    }
    const tags = [reply || replyModal ? "comment" : page ? "page" : "post"];
    if (isNSFW) tags.push("nsfw");
    const metadata = {
      content: lock
        ? inputValue.trim().slice(0, 400) + "..."
        : inputValue.trim(),
      sources: [siteName],
      external_urls: [
        reply || replyModal
          ? `https://crossbell.io${composeNoteHref(parent)}`
          : "https://crossbell.io",
      ],
      tags: tags,
      ...(lock
        ? {
            ...encrypted,
            price: price,
          }
        : { attachments: attachments }),
    } as any;

    if (reply) {
      await postNoteForNote.mutateAsync({
        note: {
          ...parent!,
        },
        metadata,
      });
    } else {
      await postNote.mutateAsync({
        metadata,
      });
    }

    if (!modal && !replyModal) {
      discardTweet();
      setLoading(false);
    }

    if (closeModal) closeModal();

    toast.success(
      () => <span className="flex gap-2">Your post was sent</span>,
      { duration: 6000 }
    );

    if (page) {
      refetchPage();
    } else {
      refetchNote();
    }
  };

  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement> | ClipboardEvent<HTMLTextAreaElement>
  ): void => {
    const isClipboardEvent = "clipboardData" in e;

    if (isClipboardEvent) {
      const isPastingText = e.clipboardData.getData("text");
      if (isPastingText) return;
    }

    const files = isClipboardEvent ? e.clipboardData.files : e.target.files;
    const imagesData = getImagesData(files, previewCount);

    if (!imagesData) {
      toast.error("Please choose a GIF or photo up to 4");
      return;
    }

    const { imagesPreviewData, selectedImagesData } = imagesData;

    setImagesPreview([...imagesPreview, ...imagesPreviewData]);
    setSelectedImages([...selectedImages, ...selectedImagesData]);

    // cleanup
    cleanAudio();
    cleanVideo();

    inputRef.current?.focus();
  };

  const handleAudioUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files?.length === 0) return;

    const audioData = getAudioData(files);

    if (!audioData) {
      toast.error("Something went wrong :(");
      return;
    }

    const { audioPreviewData, selectedAudioData } = audioData;
    setAudioPreview(audioPreviewData);
    setSelectedAudio(selectedAudioData);

    // cleanup
    cleanImage();
    cleanVideo();

    inputRef.current?.focus();
  };

  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files?.length === 0) return;

    const videoData = getVideoData(files);

    if (!videoData) {
      toast.error("Something went wrong :(");
      return;
    }

    const { videoPreviewData, selectedVideoData } = videoData;
    setVideoPreview(videoPreviewData);
    setSelectedVideo(selectedVideoData);

    // cleanup
    cleanImage();
    cleanAudio();
  };

  const removeImage = (targetId: string) => (): void => {
    setSelectedImages(selectedImages.filter(({ id }) => id !== targetId));
    setImagesPreview(imagesPreview.filter(({ id }) => id !== targetId));

    const { src } = imagesPreview.find(
      ({ id }) => id === targetId
    ) as ImageData;

    URL.revokeObjectURL(src);
  };

  const cleanImage = (): void => {
    imagesPreview.forEach(({ src }) => URL.revokeObjectURL(src));
    setSelectedImages([]);
    setImagesPreview([]);
  };

  const cleanAudio = (): void => {
    audioPreview.forEach(({ src }) => URL.revokeObjectURL(src));
    setSelectedAudio([]);
    setAudioPreview([]);
  };

  const cleanVideo = (): void => {
    videoPreview.forEach(({ src }) => URL.revokeObjectURL(src));
    setSelectedVideo([]);
    setVideoPreview([]);
  };

  const discardTweet = (): void => {
    setInputValue("");
    setVisited(false);
    cleanImage();
    cleanAudio();
    cleanVideo();
    inputRef.current?.blur();
  };

  const handleChange = ({
    target: { value },
  }: ChangeEvent<HTMLTextAreaElement>): void => setInputValue(value);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    void sendTweet(price.amount);
  };

  const handleFocus = (): void => setVisited(!loading);

  const handleSetIsNSFW = (): void => setIsNSFW((prev) => !prev);

  const formId = useId();

  const isValidInput = !!inputValue.trim().length;
  const isValidTweet = isValidInput;

  return (
    <form
      className={cn("flex flex-col", {
        "-mx-4": reply,
        "gap-2": replyModal,
        "cursor-not-allowed": disabled,
      })}
      onSubmit={handleSubmit}
    >
      {loading && (
        <motion.i className="h-1 animate-pulse bg-main-accent" {...variants} />
      )}
      {children}
      {reply && visited && (
        <motion.p
          className="-mb-2 ml-[75px] mt-2 text-light-secondary dark:text-dark-secondary"
          {...fromTop}
        >
          Replying to{" "}
          <Link
            href={`/user/${parent?.handle}`}
            className="custom-underline text-main-accent"
          >
            @{parent?.username}
          </Link>
        </motion.p>
      )}
      <label
        className={cn(
          "hover-animation grid w-full grid-cols-[auto,1fr] gap-3 px-4 py-3",
          reply
            ? "pb-1 pt-3"
            : replyModal
            ? "pt-0"
            : "border-b-2 border-light-border dark:border-dark-border",
          (disabled || loading) && "pointer-events-none opacity-50"
        )}
        htmlFor={formId}
      >
        <CharacterAvatar size={40} character={currentCharacter} />
        <div className="flex flex-col w-full gap-4">
          <InputForm
            modal={modal}
            page={page}
            reply={reply}
            formId={formId}
            visited={visited}
            loading={loading}
            inputRef={inputRef}
            replyModal={replyModal}
            inputValue={inputValue}
            isValidTweet={isValidTweet}
            isUploadingImages={isUploadingImages}
            sendTweet={sendTweet}
            handleFocus={handleFocus}
            discardTweet={discardTweet}
            handleChange={handleChange}
            handleImageUpload={handleImageUpload}
            // price={price}
            // setPrice={setPrice}
          >
            {type === "image" ? (
              isUploadingImages && (
                <ImagePreview
                  imagesPreview={imagesPreview}
                  previewCount={previewCount}
                  removeImage={!loading ? removeImage : undefined}
                />
              )
            ) : type === "audio" ? (
              <AudioPreview audioPreview={audioPreview[0].src} />
            ) : type === "video" ? (
              <VideoPreview videoPreview={videoPreview[0].src} />
            ) : null}
          </InputForm>
          <AnimatePresence initial={false}>
            {(reply ? reply && visited && !loading : !loading) && (
              <InputOptions
                reply={reply}
                modal={modal}
                isNSFW={isNSFW}
                isValidTweet={isValidTweet}
                handleSetIsNSFW={handleSetIsNSFW}
                handleImageUpload={handleImageUpload}
                handleAudioUpload={handleAudioUpload}
                handleVideoUpload={handleVideoUpload}
              />
            )}
          </AnimatePresence>
        </div>
      </label>
    </form>
  );
}

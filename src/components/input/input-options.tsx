import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HeroIcon } from "@/components/ui/hero-icon";
import { ToolTip } from "@/components/ui/tooltip";
import { variants } from "./input";
import type { ChangeEvent, ClipboardEvent } from "react";
import type { IconName } from "@/components/ui/hero-icon";
import { preventBubbling, sleep } from "@/lib/utils";
import { CustomIcon } from "../ui/custom-icon";
import cn from "clsx";

type Options = {
  name: string;
  iconName: IconName;
  disabled: boolean;
  onClick?: () => void;
}[];

const options: Readonly<Options> = [
  {
    name: "Photo",
    iconName: "PhotoIcon",
    disabled: false,
  },
  {
    name: "Video",
    iconName: "VideoCameraIcon",
    disabled: false,
  },
  {
    name: "Audio",
    iconName: "MicrophoneIcon",
    disabled: false,
  },
];

type InputOptionsProps = {
  reply?: boolean;
  modal?: boolean;
  isNSFW?: boolean;
  isValidTweet: boolean;
  handleImageUpload: (
    e: ChangeEvent<HTMLInputElement> | ClipboardEvent<HTMLTextAreaElement>
  ) => void;
  handleAudioUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  handleVideoUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSetIsNSFW: () => void;
};

export function InputOptions({
  reply,
  modal,
  isNSFW,
  isValidTweet,
  handleImageUpload,
  handleAudioUpload,
  handleVideoUpload,
  handleSetIsNSFW,
}: InputOptionsProps): JSX.Element {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<"image" | "video" | "audio" | "emoji">(
    "image"
  );

  const onClick = (): void => inputFileRef.current?.click();

  let filteredOptions = options;

  return (
    <motion.div className="flex justify-between" {...variants}>
      <div className="flex text-main-accent md:[&>button]:!block gap-2">
        <input
          className="hidden"
          type="file"
          accept={`${type}/*`}
          onChange={(e) => {
            if (type === "image") {
              handleImageUpload(e);
            } else if (type === "audio") {
              handleAudioUpload(e);
            } else if (type === "video") {
              handleVideoUpload(e);
            }
          }}
          ref={inputFileRef}
          multiple={type === "image"}
        />
        {filteredOptions.map(({ name, iconName }) => (
          <Button
            className="relative p-2 rounded-lg bg-gray-700/[0.5] bottom-1 accent-tab accent-bg-tab group hover:bg-main-accent/10 active:bg-main-accent/20 gap-4"
            onClick={async () => {
              setType(name.toLowerCase() as "image" | "video" | "audio");
              await sleep(100);
              onClick();
            }}
            key={name}
          >
            <div className="flex flex-row items-center gap-1">
              <HeroIcon className="w-5 h-5" iconName={iconName} />
              <div className="text-sm text-light-secondary">{name}</div>
              {/* text-light-secondary */}
            </div>

            <ToolTip tip={name} modal={modal} />
          </Button>
        ))}
      </div>
      <div className="flex flex-row items-center gap-4">
        <button
          className={cn(isNSFW ? "opacity-100 text-main-accent" : "opacity-20")}
          onClick={(e) => {
            handleSetIsNSFW();
            e.preventDefault();
          }}
        >
          <CustomIcon iconName="Eighteen" />
        </button>
        <Button
          type="submit"
          className="accent-tab bg-main-accent px-4 py-1.5 font-bold text-white
                     enabled:hover:bg-main-accent/90
                     enabled:active:bg-main-accent/75"
          disabled={!isValidTweet}
        >
          {reply ? "Reply" : "Post"}
        </Button>
      </div>
    </motion.div>
  );
}

import cn from "clsx";
import { preventBubbling } from "@/lib/utils";
import { HeroIcon } from "../ui/hero-icon";
import { Button } from "../ui/button";
import useAudioPlayer from "@/lib/hooks/useAudioPlayer";

export default function AudioPreview({
  viewTweet,
  audioPreview,
  tweet,
}: {
  viewTweet?: boolean;
  audioPreview: string;
  tweet?: boolean;
}) {
  const { waveformRef, playPause } = useAudioPlayer(audioPreview);

  const togglePlay = () => {
    playPause?.();
  };

  if (!audioPreview) return null;

  const isTweet = tweet ?? viewTweet;

  return (
    <div
      className={cn(
        "hover-animation relative flex flex-row items-center justify-center",
        viewTweet
          ? "h-[51vw] xs:h-[42vw] md:h-[305px]"
          : "h-[42vw] xs:h-[37vw] md:h-[271px]",
        isTweet && "mt-2"
      )}
    >
      <div className="w-[80%]" ref={waveformRef} />
      <Button
        className="absolute bottom-2 right-2"
        onClick={preventBubbling(togglePlay)}
      >
        <HeroIcon
          iconName="PlayPauseIcon"
          solid
          className="h-6 w-6 text-light-secondary transition-all hover:text-[#1df485] dark:text-dark-secondary"
        />
      </Button>
    </div>
  );
}

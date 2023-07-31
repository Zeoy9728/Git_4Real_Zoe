import cn from "clsx";

export default function VideoPreview({
  viewTweet,
  videoPreview,
  tweet,
}: {
  viewTweet?: boolean;
  videoPreview: string;
  tweet?: boolean;
}) {
  const isTweet = tweet ?? viewTweet;
  return (
    <div
      className={cn(
        "hover-animation flex flex-row items-center justify-center",
        viewTweet
          ? "h-[51vw] xs:h-[42vw] md:h-[305px]"
          : "h-[42vw] xs:h-[37vw] md:h-[271px]",
        isTweet && "mt-2"
      )}
    >
      <video
        className="h-full w-full rounded-2xl object-cover"
        controls={true}
        src={videoPreview}
      />
    </div>
  );
}

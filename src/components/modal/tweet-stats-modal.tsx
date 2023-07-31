import { MainHeader } from "@/components/home/main-header";
import type { ReactNode } from "react";
import type { StatsType } from "@/components/view/view-tweet-stats";

type TweetStatsModalProps = {
  children: ReactNode;
  statsType: StatsType | null;
  handleClose: () => void;
};

export function TweetStatsModal({
  children,
  statsType,
  handleClose,
}: TweetStatsModalProps): JSX.Element {
  return (
    <>
      <MainHeader
        useActionButton
        disableSticky
        tip="Close"
        iconName="XMarkIcon"
        className="absolute flex items-center w-full gap-6 rounded-tl-2xl"
        title={`${statsType === "marked" ? "Marked" : "Replied"} by`}
        action={handleClose}
      />
      {children}
    </>
  );
}

import cn from "clsx";
import { Button } from "../ui/button";
import { useIsOpSignEnabled, useWalletSignIn } from "@crossbell/connect-kit";

export default function EncryptPreview({
  viewTweet,
  tweet,
  openPatronModal,
}: {
  viewTweet?: boolean;
  tweet: any;
  openPatronModal?: () => void;
}) {
  const isSignIn = useIsOpSignEnabled(undefined);
  const walletSignIn = useWalletSignIn();

  const isTweet = tweet ?? viewTweet;
  const price = tweet?.metadata?.content?.price ?? 0;

  const unlock = () => {
    if (!isSignIn) {
      walletSignIn.mutate(undefined, {
        onSuccess: () => {
          openPatronModal?.();
        },
      });
      return;
    } else {
      openPatronModal?.();
    }
  };

  return (
    <div
      className={cn(
        "hover-animation relative",
        viewTweet
          ? "h-[51vw] xs:h-[42vw] md:h-[305px]"
          : "h-[42vw] xs:h-[37vw] md:h-[271px]",
        isTweet && "mt-2"
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        unlock();
      }}
    >
      {/* background image */}
      <svg
        className="z-0 block w-full h-full dark:hidden"
        viewBox="0 0 509 247"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_824_7269)">
          <rect width="509" height="247" fill="#EBEEF0" />
          <path d="M-95 -2H118L403 278H-95V-2Z" fill="#E4E9EC" />
          <g opacity="0.5">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M99 119H-15V282H147V167L99 119Z"
              fill="#F1F3F4"
            />
            <path d="M99 119L147.5 167.5H99V119Z" fill="#D1DAE1" />
          </g>
          <g opacity="0.5">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M415.5 33H529.5V263.5H367.5V81L415.5 33Z"
              fill="#F8F8F8"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M518 106C518 111.523 513.523 116 508 116C502.477 116 498 111.523 498 106C498 100.477 502.477 96 508 96C513.523 96 518 100.477 518 106ZM492.828 125.172L514.968 147.316C519.504 151.844 522 157.872 522 164.284V180C522 182.208 520.212 184 518 184H414C411.788 184 410 182.208 410 180V156.284C410 149.872 412.496 143.844 417.032 139.312L439.172 117.172C439.92 116.42 440.936 116 442 116H446C447.064 116 448.08 116.42 448.828 117.172L470 138.344L483.172 125.172C483.92 124.42 484.936 124 486 124H490C491.064 124 492.08 124.42 492.828 125.172ZM418 176H514V164.284C514 160.044 512.316 155.976 509.316 152.976L488.344 132H487.656L475.656 144L484.828 153.172C481.704 156.296 476.64 156.296 473.516 153.172L444.344 124H443.656L422.688 144.972C419.688 147.972 418 152.044 418 156.288V176Z"
              fill="#EBEEF0"
            />
            <path d="M416.5 33L368 81.5H416.5V33Z" fill="#D0D5D8" />
          </g>
        </g>
        <rect
          x="0.5"
          y="0.5"
          width="508"
          height="246"
          rx="15.5"
          stroke="#EBEEF0"
        />
        <defs>
          <clipPath id="clip0_824_7269">
            <rect width="509" height="247" rx="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <svg
        className="z-0 hidden w-full h-full dark:block"
        viewBox="0 0 509 247"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_824_2853)">
          <rect width="509" height="247" fill="#343B61" />
          <path d="M-95 -2H118L403 278H-95V-2Z" fill="#2E3558" />
          <g opacity="0.5">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M99 119H-15V282H147V167L99 119Z"
              fill="#393E68"
            />
            <path d="M99 119L147.5 167.5H99V119Z" fill="#21253E" />
          </g>
          <g opacity="0.5">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M415.5 33H529.5V263.5H367.5V81L415.5 33Z"
              fill="#292D4C"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M518 106C518 111.523 513.523 116 508 116C502.477 116 498 111.523 498 106C498 100.477 502.477 96 508 96C513.523 96 518 100.477 518 106ZM492.828 125.172L514.968 147.316C519.504 151.844 522 157.872 522 164.284V180C522 182.208 520.212 184 518 184H414C411.788 184 410 182.208 410 180V156.284C410 149.872 412.496 143.844 417.032 139.312L439.172 117.172C439.92 116.42 440.936 116 442 116H446C447.064 116 448.08 116.42 448.828 117.172L470 138.344L483.172 125.172C483.92 124.42 484.936 124 486 124H490C491.064 124 492.08 124.42 492.828 125.172ZM418 176H514V164.284C514 160.044 512.316 155.976 509.316 152.976L488.344 132H487.656L475.656 144L484.828 153.172C481.704 156.296 476.64 156.296 473.516 153.172L444.344 124H443.656L422.688 144.972C419.688 147.972 418 152.044 418 156.288V176Z"
              fill="#343B61"
            />
            <path d="M415.5 33L367 81.5H415.5V33Z" fill="#21253E" />
          </g>
        </g>
        <rect
          x="0.5"
          y="0.5"
          width="508"
          height="246"
          rx="15.5"
          stroke="#343B61"
        />
        <defs>
          <clipPath id="clip0_824_2853">
            <rect width="509" height="247" rx="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
      {/* unlock button */}
      <Button className="absolute text-lg font-bold text-white transition -translate-x-1/2 outline-none hover:brightness-90 active:brightness-75 top-1/3 left-1/2">
        <svg
          width="49"
          height="49"
          viewBox="0 0 49 49"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="49" height="49" rx="20" fill="#1DF485" />
          <path
            d="M22.5 23.8125H26.5L28.5 33.8125H20.5L22.5 23.8125Z"
            fill="#1F2345"
          />
          <circle cx="24.5" cy="20.1875" r="5" fill="#1F2345" />
        </svg>
      </Button>
      {/* price */}
      <div className="absolute flex flex-row items-center justify-center w-full bottom-12">
        <p className="block font-bold text-main-accent">
          {price / 100} MIRA Unlock
        </p>
      </div>
    </div>
  );
}

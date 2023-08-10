import { useEffect } from "react";
import TextArea from "react-textarea-autosize";
import { AnimatePresence, motion } from "framer-motion";
import { useModal } from "@/lib/hooks/useModal";
import { Modal } from "@/components/modal/modal";
import { ActionModal } from "@/components/modal/action-modal";
import { HeroIcon } from "@/components/ui/hero-icon";
import { Button } from "@/components/ui/button";
import type {
  ReactNode,
  RefObject,
  ChangeEvent,
  KeyboardEvent,
  ClipboardEvent,
} from "react";
import type { Variants } from "framer-motion";
import { Menu } from "@headlessui/react";
import cn from "clsx";

type InputFormProps = {
  modal?: boolean;
  page?: boolean;
  formId: string;
  loading: boolean;
  visited: boolean;
  reply?: boolean;
  children: ReactNode;
  inputRef: RefObject<HTMLTextAreaElement>;
  inputValue: string;
  replyModal?: boolean;
  isValidTweet: boolean;
  isUploadingImages: boolean;
  sendTweet: (price?: number) => Promise<void>;
  handleFocus: () => void;
  discardTweet: () => void;
  handleChange: ({
    target: { value },
  }: ChangeEvent<HTMLTextAreaElement>) => void;
  handleImageUpload: (
    e: ChangeEvent<HTMLInputElement> | ClipboardEvent<HTMLTextAreaElement>
  ) => void;
  price: any;
  setPrice: (price: any) => void;
};

// export const PRICE_LIST = [
//   {
//     text: "Free",
//     amount: undefined,
//   },
//   {
//     text: "1 MIRA",
//     amount: 100,
//   },
//   {
//     text: "5 MIRA",
//     amount: 500,
//   },
//   {
//     text: "10 MIRA",
//     amount: 1000,
//   },
// ];

const variants: Variants[] = [
  {
    initial: { y: -25, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: "spring" } },
  },
  {
    initial: { x: 25, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { type: "spring" } },
  },
];

export const [fromTop, fromBottom] = variants;

export function InputForm({
  modal,
  page,
  reply,
  formId,
  loading,
  visited,
  children,
  inputRef,
  replyModal,
  inputValue,
  isValidTweet,
  isUploadingImages,
  sendTweet,
  handleFocus,
  discardTweet,
  handleChange,
  handleImageUpload,
  price,
  setPrice,
}: InputFormProps): JSX.Element {
  const { open, openModal, closeModal } = useModal();

  useEffect(() => handleShowHideNav(true), []);

  const handleKeyboardShortcut = ({
    key,
    ctrlKey,
  }: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (!modal && key === "Escape")
      if (isValidTweet) {
        inputRef.current?.blur();
        openModal();
      } else discardTweet();
    else if (ctrlKey && key === "Enter" && isValidTweet)
      void sendTweet(price.amount);
  };

  const handleShowHideNav = (blur?: boolean) => (): void => {
    const sidebar = document.getElementById("sidebar") as HTMLElement;

    if (!sidebar) return;

    if (blur) {
      setTimeout(() => (sidebar.style.opacity = ""), 200);
      return;
    }

    if (window.innerWidth < 500) sidebar.style.opacity = "0";
  };

  const handleFormFocus = (): void => {
    handleShowHideNav()();
    handleFocus();
  };

  const handleClose = (): void => {
    discardTweet();
    closeModal();
  };

  const isVisibilityShown =
    visited && !reply && !replyModal && !loading && !page;

  return (
    <div className="flex min-h-[48px] w-full flex-col justify-center gap-1">
      <Modal
        modalClassName="max-w-xs bg-main-background w-full p-8 rounded-2xl"
        open={open}
        closeModal={closeModal}
      >
        <ActionModal
          title="Discard Post?"
          description="This can’t be undone and you’ll lose your draft."
          mainBtnClassName="bg-accent-red hover:bg-accent-red/90 active:bg-accent-red/75"
          mainBtnLabel="Discard"
          action={handleClose}
          closeModal={closeModal}
        />
      </Modal>
      <div className="relative flex flex-col gap-2">
        {isVisibilityShown && (
          <Menu>
            <Menu.Button
              // className="flex items-center self-start gap-1 px-3 py-0 border custom-button accent-tab accent-bg-tab border-light-line-reply text-main-accent hover:bg-main-accent/10 active:bg-main-accent/20 dark:border-light-secondary"
              // {...fromTop}
            >
              {/* <p className="font-bold">{price.text}</p> */}
              {/* <HeroIcon className="w-4 h-4" iconName="ChevronDownIcon" /> */}
            </Menu.Button>
            <AnimatePresence>
              <Menu.Items
                className="absolute left-0 menu-container top-8 w-60"
                as={motion.div}
                {...fromTop}
              >
                {/* {PRICE_LIST.map((item) => (
                  <Menu.Item key={item.text}>
                    {() => (
                      <div
                        className={cn(
                          "flex cursor-pointer items-center justify-between gap-4 border-b border-light-border px-4 py-3 font-bold text-main-accent dark:border-dark-border"
                        )}
                        onClick={() => setPrice(item)}
                      >
                        {item.text}
                      </div>
                    )}
                  </Menu.Item>
                ))} */}
              </Menu.Items>
            </AnimatePresence>
          </Menu>
        )}
        <div className="flex items-center max-h-full gap-3">
          <TextArea
            id={formId}
            className="w-full min-w-0 p-0 text-xl border-solid rounded-lg outline-none resize-none bg-gray-700/[0.9] outline-1px border-slate-500 placeholder:text-light-secondary dark:placeholder:text-dark-secondary"
            value={inputValue}
            placeholder={
              reply || replyModal
                ? "Post your reply"
                : page
                ? "Post your page"
                : "What's happening?"
            }
            onBlur={handleShowHideNav(true)}
            minRows={loading ? 1 : modal && !isUploadingImages ? 3 : 1}
            maxRows={isUploadingImages ? 5 : 15}
            onFocus={handleFormFocus}
            onPaste={handleImageUpload}
            onKeyUp={handleKeyboardShortcut}
            onChange={handleChange}
            ref={inputRef}
          />
          {reply && !visited && (
            <Button
              className="cursor-pointer bg-main-accent px-4 py-1.5 font-bold text-white opacity-50"
              onClick={handleFocus}
            >
              Reply
            </Button>
          )}
        </div>
      </div>
      {children}
      {isVisibilityShown && (
        <motion.div
          className="flex pb-2 border-b border-light-border dark:border-dark-border"
          {...fromBottom}
        >
          <button
            type="button"
            className="flex items-center gap-1 px-3 py-0 custom-button accent-tab accent-bg-tab text-main-accent hover:bg-main-accent/10 active:bg-main-accent/20"
          >
            {/* {!price.amount ? (
              <>
                <HeroIcon className="w-4 h-4" iconName="GlobeAmericasIcon" />
                <p className="font-bold">Accessible to everyone</p>
              </>
            ) : (
              <>
                <HeroIcon className="w-4 h-4" iconName="LockClosedIcon" />
                <p className="font-bold">Requires {price.text} to unlock</p>
              </>
            )} */}
          </button>
        </motion.div>
      )}
    </div>
  );
}

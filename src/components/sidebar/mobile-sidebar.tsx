import { useModal } from "@/lib/hooks/useModal";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modal/modal";
import { MobileSidebarModal } from "./mobile-sidebar-modal";
import type { Variants } from "framer-motion";
import { useAccountState } from "@crossbell/connect-kit";
import { CharacterAvatar } from "@crossbell/ui";

const variant: Variants = {
  initial: { x: "-100%", opacity: 0.8 },
  animate: {
    x: -8,
    opacity: 1,
    transition: { type: "spring", duration: 0.8 },
  },
  exit: { x: "-100%", opacity: 0.8, transition: { duration: 0.4 } },
};

export function MobileSidebar(): JSX.Element {
  const { open, openModal, closeModal } = useModal();
  const [currentCharacter] = useAccountState(({ computed }) => [
    computed.account?.character,
  ]);

  return (
    <>
      <Modal
        className="!p-0"
        modalAnimation={variant}
        modalClassName="pb-4 pl-2 min-h-screen w-72 bg-main-background"
        open={open}
        closeModal={closeModal}
      >
        <MobileSidebarModal closeModal={closeModal} />
      </Modal>
      <Button className="accent-tab p-0 xs:hidden" onClick={openModal}>
        <CharacterAvatar size={30} character={currentCharacter} />
      </Button>
    </>
  );
}

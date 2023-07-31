/* eslint-disable @next/next/no-img-element */
import { ImageModal } from "@/components/modal/image-modal";
import { Modal } from "@/components/modal/modal";
import { useModal } from "@/lib/hooks/useModal";
import React from "react";
import cn from "clsx";

export function Img(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const { open, openModal, closeModal } = useModal();
  return (
    <>
      <Modal
        modalClassName={cn(
          "flex justify-center w-full items-center relative h-full"
        )}
        open={open}
        closeModal={closeModal}
        closePanelOnClick
      >
        <ImageModal
          tweet={true}
          imageData={{ src: props.src!, alt: props.alt! }}
          previewCount={1}
        />
      </Modal>
      <img
        onClick={(e) => {
          openModal();
          e.stopPropagation();
          e.preventDefault();
        }}
        className="my-2 cursor-pointer rounded-2xl"
        {...props}
        alt={props.alt}
      />
    </>
  );
}

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useModal } from "@/lib/hooks/useModal";
import { sleep } from "@/lib/utils";
import { getImagesData } from "@/lib/validation";
import { Modal } from "@/components/modal/modal";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/input/input-field";
import type { ChangeEvent, KeyboardEvent } from "react";
import { EditProfileModal } from "../modal/edit-profile-modal";
import {
  useAccountCharacter,
  useUpdateCharacterHandle,
  useUpdateCharacterMetadata,
} from "@crossbell/connect-kit";
import {
  extractCharacterAvatar,
  extractCharacterBanners,
  extractCharacterName,
} from "@crossbell/util-metadata";
import { uploadFiles } from "@/lib/upload-file";
import { FilesWithId } from "@/lib/types/file";
import { ipfsLinkToHttpLink } from "@/lib/ipfs";
import { ReactSortable } from "react-sortablejs";
import { nanoid } from "nanoid";
import { PLATFORM_LIST, Platform } from "../common/platform";
import { CustomIcon } from "../ui/custom-icon";
import { HeroIcon } from "../ui/hero-icon";
import Marquee from "react-fast-marquee";

type Item = {
  identity: string;
  platform: string;
  url?: string | undefined;
} & {
  id: string;
};

type UpdateItem = (id: string, newItem: Partial<Item>) => void;

type RemoveItem = (id: string) => void;

const SortableNavigationItem = ({
  item,
  updateItem,
  removeItem,
}: {
  item: Item;
  updateItem: UpdateItem;
  removeItem: RemoveItem;
}) => {
  return (
    <div className="flex items-center gap-4">
      <div>
        <button
          type="button"
          className="flex items-center justify-center drag-handle cursor-grab text-light-secondary dark:text-dark-secondary"
        >
          <CustomIcon iconName="DotsIcon" />
        </button>
      </div>
      <Platform platform={item.platform} username={item.identity}></Platform>
      <div className="flex items-center flex-1 gap-4 text-light-secondary dark:text-dark-secondary">
        <input
          className="bg-transparent outline-none"
          type="text"
          placeholder={"Platform"}
          value={item.platform}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            updateItem(item.id, { platform: e.target.value })
          }
        />
        <input
          className="bg-transparent outline-none"
          type="text"
          placeholder={"Identity"}
          value={item.identity}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            updateItem(item.id, { identity: e.target.value })
          }
        />
      </div>
      <button onClick={() => removeItem(item.id)}>
        <HeroIcon
          iconName="TrashIcon"
          className="w-4 h-4 stroke-2 text-light-secondary dark:text-dark-secondary hover:text-accent-red"
        />
      </button>
    </div>
  );
};

export function UserEditProfile(): JSX.Element {
  const { open, openModal, closeModal } = useModal();

  const [loading, setLoading] = useState(false);

  const currentAccount = useAccountCharacter();

  const updateMetadata = useUpdateCharacterMetadata();
  const updateHandle = useUpdateCharacterHandle();

  const { bio, name, handle, photoURL, coverPhotoURL, connectedAccounts } = {
    name: extractCharacterName(currentAccount),
    handle: currentAccount?.handle!,
    bio: currentAccount?.metadata?.content?.bio,
    photoURL: extractCharacterAvatar(currentAccount),
    coverPhotoURL:
      extractCharacterBanners(currentAccount)?.[0]?.address ?? null,
    connectedAccounts:
      currentAccount?.metadata?.content?.connected_accounts?.map((item) => {
        const match = item.match(/:\/\/account:(.*)@(.*)/);
        if (match) {
          return {
            id: nanoid(),
            identity: match[1],
            platform: match[2],
          };
        } else {
          return {
            id: nanoid(),
            identity: item,
            platform: "",
          };
        }
      }),
  };

  const [editUserData, setEditUserData] = useState<{
    bio?: string;
    name: string;
    handle: string;
    photoURL?: string;
    coverPhotoURL?: string;
    connectedAccounts?: Item[];
  }>({
    bio,
    name,
    handle,
    photoURL,
    coverPhotoURL,
    connectedAccounts,
  });

  type EditableData = Extract<
    keyof typeof editUserData,
    "bio" | "name" | "handle" | "photoURL" | "coverPhotoURL"
  >;

  const [userImages, setUserImages] = useState<{
    photoURL: FilesWithId;
    coverPhotoURL: FilesWithId;
  }>({
    photoURL: [],
    coverPhotoURL: [],
  });

  const inputNameError = !editUserData.name?.trim()
    ? "Name can't be blank"
    : "";

  const inputFields: Readonly<
    {
      label: string;
      inputId: EditableData;
      inputValue: string;
      inputLimit?: number;
      errorMessage?: string;
      useTextArea?: boolean;
    }[]
  > = [
    {
      label: "Name",
      inputId: "name",
      inputValue: editUserData.name,
      inputLimit: 50,
      errorMessage: inputNameError,
    },
    {
      label: "Handle",
      inputId: "handle",
      inputValue: editUserData.handle,
      inputLimit: 30,
    },
    {
      label: "Bio",
      inputId: "bio",
      inputValue: editUserData.bio ?? "",
      inputLimit: 160,
      useTextArea: true,
    },
  ];

  const updateData = async (): Promise<void> => {
    if (!currentAccount) {
      toast.error("Please login first");
      return;
    }
    setLoading(true);
    const { photoURL, coverPhotoURL: coverURL } = userImages;
    const [newPhotoURL, newCoverPhotoURL] = await Promise.all(
      [photoURL, coverURL].map(async (image) => uploadFiles(image))
    );
    const newImages = {
      coverPhotoURL: newCoverPhotoURL
        ? newCoverPhotoURL?.[0].address
        : undefined,
      ...{ photoURL: newPhotoURL?.[0].address ?? editUserData.photoURL },
    };
    const trimmedKeys: Readonly<EditableData[]> = ["name", "handle", "bio"];
    const trimmedTexts = trimmedKeys.reduce(
      (acc, curr) => ({ ...acc, [curr]: editUserData[curr]?.trim() ?? null }),
      {}
    );
    const newUserData = {
      ...editUserData,
      ...trimmedTexts,
      ...newImages,
    };
    await sleep(500);
    const processList: { tips: string; action: () => Promise<unknown> }[] = [];

    if (editUserData.handle !== currentAccount.handle) {
      processList.push({
        tips: "Updating handle",
        action: () =>
          updateHandle.mutateAsync({
            characterId: currentAccount.characterId,
            handle: currentAccount.handle,
          }),
      });
    }

    processList.push({
      tips: "Updating metadata",
      action: async () => {
        return updateMetadata.mutateAsync({
          characterId: currentAccount.characterId,
          edit(metadata) {
            const photoURL = newImages.photoURL || editUserData.photoURL;
            metadata.type = metadata.type ?? "character";
            metadata.name = editUserData.name ?? editUserData.handle;
            metadata.avatars = photoURL ? [photoURL] : [];
            metadata.bio = editUserData.bio;
            metadata.banners = newCoverPhotoURL?.[0]?.address
              ? [
                  {
                    address: newCoverPhotoURL?.[0]?.address,
                    ...newCoverPhotoURL?.[0],
                  },
                ]
              : currentAccount?.metadata?.content?.banners ?? [];
            metadata.connected_accounts =
              editUserData.connectedAccounts?.map((account) => {
                if (account.identity && account.platform) {
                  return `csb://account:${
                    account.identity
                  }@${account.platform.toLowerCase()}`;
                } else if (typeof account === "string") {
                  return account;
                } else {
                  return "";
                }
              }) ?? [];
          },
        });
      },
    });

    for (const [, { action }] of processList.entries()) {
      await action();
    }

    closeModal();
    cleanImage();
    setLoading(false);
    setEditUserData(newUserData);
    toast.success("Profile updated successfully");
  };

  const editImage =
    (type: "cover" | "profile") =>
    ({ target: { files } }: ChangeEvent<HTMLInputElement>): void => {
      const imagesData = getImagesData(files);
      if (!imagesData) {
        toast.error("Please choose a valid GIF or Photo");
        return;
      }
      const { imagesPreviewData, selectedImagesData } = imagesData;
      const targetKey = type === "cover" ? "coverPhotoURL" : "photoURL";
      const newImage = imagesPreviewData[0].src;
      setEditUserData({
        ...editUserData,
        [targetKey]: newImage,
      });
      setUserImages({
        ...userImages,
        [targetKey]: selectedImagesData,
      });
    };

  const removeCoverImage = (): void => {
    setEditUserData({
      ...editUserData,
      coverPhotoURL: undefined,
    });
    setUserImages({
      ...userImages,
      coverPhotoURL: [],
    });
    URL.revokeObjectURL(editUserData.coverPhotoURL ?? "");
  };

  const cleanImage = (): void => {
    const imagesKey: Readonly<EditableData[]> = ["photoURL", "coverPhotoURL"];
    imagesKey.forEach((image) =>
      URL.revokeObjectURL(editUserData[image] ?? "")
    );
    setUserImages({
      photoURL: [],
      coverPhotoURL: [],
    });
  };

  const resetUserEditData = (): void =>
    setEditUserData({
      bio,
      name,
      handle,
      photoURL,
      coverPhotoURL,
      connectedAccounts,
    });

  const handleChange =
    (key: string) =>
    ({
      target: { value },
    }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setEditUserData({ ...editUserData, [key]: value });

  const handleKeyboardShortcut = ({
    key,
    ctrlKey,
  }: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    if (ctrlKey && key === "Enter" && !inputNameError) {
      void updateData();
    }
  };

  const updateItem = (id: string, newItem: Partial<Item>) => {
    setEditUserData((prev) => {
      const items = prev.connectedAccounts;
      const newItems =
        items?.map((item) => {
          if (item.id === id) {
            return { ...item, ...newItem };
          }
          return item;
        }) || [];
      return { ...prev, connectedAccounts: newItems };
    });
  };

  const setItems = (items: Item[]) => {
    setEditUserData((prev) => ({ ...prev, connectedAccounts: items }));
  };

  const removeItem = (id: string) => {
    setEditUserData((prev) => {
      const items = prev.connectedAccounts;
      const newItems = items?.filter((item) => item.id !== id) || [];
      return { ...prev, connectedAccounts: newItems };
    });
  };

  const newEmptyItem = () => {
    setEditUserData((prev) => ({
      ...prev,
      connectedAccounts: [
        ...(prev.connectedAccounts || []),
        { id: nanoid(), platform: "", identity: "" },
      ],
    }));
  };

  return (
    <form>
      <Modal
        modalClassName="relative bg-main-background rounded-2xl max-w-xl w-full h-[672px] overflow-hidden"
        open={open}
        closeModal={closeModal}
      >
        <EditProfileModal
          name={name}
          loading={loading}
          photoURL={
            editUserData.photoURL
              ? ipfsLinkToHttpLink(editUserData.photoURL)
              : ""
          }
          coverPhotoURL={
            editUserData.coverPhotoURL
              ? ipfsLinkToHttpLink(editUserData.coverPhotoURL)
              : undefined
          }
          inputNameError={inputNameError}
          editImage={editImage}
          closeModal={closeModal}
          updateData={updateData}
          removeCoverImage={removeCoverImage}
          resetUserEditData={resetUserEditData}
        >
          {inputFields.map((inputData) => (
            <InputField
              {...inputData}
              handleChange={handleChange(inputData.inputId)}
              handleKeyboardShortcut={handleKeyboardShortcut}
              key={inputData.inputId}
            />
          ))}
          <div className="flex flex-col gap-4 p-3 rounded ring-1 ring-light-line-reply dark:ring-dark-border">
            <div className="flex flex-row items-center justify-between">
              <div className="text-sm text-light-secondary dark:text-dark-secondary">
                Social platform accounts
              </div>
              <button
                onClick={() => {
                  newEmptyItem();
                }}
              >
                <HeroIcon iconName="PlusIcon" className="w-5 h-5" />
              </button>
            </div>
            <ReactSortable
              list={editUserData.connectedAccounts || []}
              setList={setItems}
              handle=".drag-handle"
              className="flex flex-col w-full gap-4"
            >
              {!editUserData.connectedAccounts ||
              editUserData.connectedAccounts?.length === 0 ? (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col text-sm text-light-secondary dark:text-dark-secondary">
                    <span>{"No Connected Account Yet :("}</span>
                  </div>
                  <Marquee>
                    <div className="flex flex-row items-center gap-4 pr-4">
                      {PLATFORM_LIST.map((item) => (
                        <Platform key={item} platform={item}></Platform>
                      ))}
                    </div>
                  </Marquee>
                </div>
              ) : (
                <>
                  {editUserData.connectedAccounts?.map((item) => (
                    <SortableNavigationItem
                      key={item.id}
                      item={item}
                      updateItem={updateItem}
                      removeItem={removeItem}
                    />
                  ))}
                </>
              )}
            </ReactSortable>
          </div>
        </EditProfileModal>
      </Modal>
      <Button
        className="dark-bg-tab self-start border border-light-line-reply px-4 py-1.5 font-bold
                   hover:bg-light-primary/10 active:bg-light-primary/20 dark:border-light-secondary
                   dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20"
        onClick={openModal}
      >
        Edit profile
      </Button>
    </form>
  );
}

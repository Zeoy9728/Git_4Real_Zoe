import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "@headlessui/react";
import cn from "clsx";
import { Button } from "@/components/ui/button";
import { HeroIcon } from "@/components/ui/hero-icon";
import { CustomIcon } from "@/components/ui/custom-icon";
import { CharacterAvatar } from "@crossbell/ui";
import { UserName } from "./user-name";
import { UserUsername } from "./user-username";
import { variants } from "../sidebar/more-settings";
import {
  useAccountCharacter,
  useAccountCharacters,
  useDisconnectModal,
  useSwitchCharacter,
} from "@crossbell/connect-kit";
import { extractCharacterName } from "@crossbell/util-metadata";

export function UserProfile(): JSX.Element {
  const currentCharacter = useAccountCharacter();
  const { characters } = useAccountCharacters();
  const disconnectModal = useDisconnectModal();
  const switchCharacter = useSwitchCharacter();

  return (
    <>
      <Menu className="relative" as="section">
        {({ open }): JSX.Element => (
          <>
            <Menu.Button
              className={cn(
                `custom-button main-tab dark-bg-tab flex w-full items-center 
                 justify-between hover:bg-light-primary/10 active:bg-light-primary/20
                 dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20`,
                open && "bg-light-primary/10 dark:bg-dark-primary/10"
              )}
            >
              <div className="flex gap-3 truncate">
                <CharacterAvatar size={40} character={currentCharacter} />
                <div className="hidden leading-5 truncate text-start xl:block">
                  <UserName
                    name={extractCharacterName(currentCharacter)}
                    className="start"
                    verified={false}
                  />
                  <UserUsername
                    username={currentCharacter?.handle!}
                    disableLink
                  />
                </div>
              </div>
              <HeroIcon
                className="hidden w-6 h-6 xl:block"
                iconName="EllipsisHorizontalIcon"
              />
            </Menu.Button>
            <AnimatePresence>
              {open && (
                <Menu.Items
                  className="absolute left-0 right-0 menu-container bottom-20 w-60 xl:w-full"
                  as={motion.div}
                  {...variants}
                  static
                >
                  {characters.map((character, index) => (
                    <Menu.Item
                      key={index}
                      className={cn(
                        "flex items-center justify-between gap-4 border-b border-light-border px-4 py-3 dark:border-dark-border",
                        character.handle !== currentCharacter?.handle
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                      )}
                      as="div"
                      disabled={character.handle === currentCharacter?.handle}
                      onClick={() => {
                        switchCharacter(character);
                      }}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <CharacterAvatar size={40} character={character} />
                        <div className="truncate">
                          <UserName
                            name={extractCharacterName(character)}
                            verified={false}
                          />
                          <UserUsername
                            username={character?.handle!}
                            disableLink
                          />
                        </div>
                      </div>
                      {character.handle === currentCharacter?.handle && (
                        <i>
                          <HeroIcon
                            className="w-5 h-5 text-main-accent"
                            iconName="CheckIcon"
                          />
                        </i>
                      )}
                    </Menu.Item>
                  ))}

                  <Menu.Item>
                    {({ active }): JSX.Element => (
                      <Button
                        className={cn(
                          "flex w-full gap-3 rounded-md rounded-t-none p-4",
                          active && "bg-main-sidebar-background"
                        )}
                        onClick={disconnectModal.show}
                      >
                        <HeroIcon iconName="ArrowRightOnRectangleIcon" />
                        Disconnect
                      </Button>
                    )}
                  </Menu.Item>
                  <i
                    className="absolute -bottom-[10px] left-2 translate-x-1/2 rotate-180
                               [filter:drop-shadow(#cfd9de_1px_-1px_1px)] 
                               dark:[filter:drop-shadow(#333639_1px_-1px_1px)]
                               xl:left-1/2 xl:-translate-x-1/2"
                  >
                    <CustomIcon
                      className="w-6 h-4 fill-main-background"
                      iconName="TriangleIcon"
                    />
                  </i>
                </Menu.Items>
              )}
            </AnimatePresence>
          </>
        )}
      </Menu>
    </>
  );
}

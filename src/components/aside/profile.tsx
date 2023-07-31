import { motion } from "framer-motion";
import { Loading } from "@/components/ui/loading";
import { Error } from "@/components/ui/error";
import { variants } from "./aside-trends";
import {
  useAccountBalance,
  useAccountMiraBalance,
  useAccountCharacter,
  useSelectCharactersModal,
  useAccountState,
  useConnectModal,
  useDisconnectModal,
} from "@crossbell/connect-kit";
import { extractCharacterName } from "@crossbell/util-metadata";
import { CharacterAvatar } from "@crossbell/ui";
import { UserTooltip } from "@/components/user/user-tooltip";
import { UserName } from "@/components/user/user-name";
import { UserUsername } from "@/components/user/user-username";
import { useTheme } from "@/lib/context/theme-context";
import { CustomIcon } from "@/components/ui/custom-icon";
import { Button } from "../ui/button";
import { HeroIcon } from "../ui/hero-icon";

export function Profile(): JSX.Element | null {
  const connectModal = useConnectModal();
  const disconnectModal = useDisconnectModal();
  const [isConnected] = useAccountState(({ computed }) => [!!computed.account]);
  const { balance: csbBalance, isLoading: csbLoading } = useAccountBalance();
  const { balance: miraBalance, isLoading: miraLoading } =
    useAccountMiraBalance();
  const currentCharacter = useAccountCharacter();
  const selectCharactersModal = useSelectCharactersModal();
  const { theme } = useTheme();
  const isBalanceLoading = csbLoading || miraLoading;

  if (!isConnected) {
    return (
      <section className="flex flex-col px-4 py-3 rounded-2xl bg-main-sidebar-background">
        <h2 className="mb-4 text-xl font-extrabold">Start to explore 🥳</h2>
        <p className="mb-4 text-sm">
          {"Just click that 'Connect' button and let the fun begin!"}
        </p>
        <div className="flex flex-row items-center justify-end">
          <Button
            className="self-start border bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90 
                     focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border 
                     dark:text-light-primary dark:hover:bg-light-border/90 dark:focus-visible:bg-light-border/90 
                     dark:active:bg-light-border/75"
            onClick={connectModal.show}
          >
            <p className="block">Connect</p>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section
      className="hover-animation rounded-2xl bg-main-sidebar-background"
      style={{
        background:
          theme == "light"
            ? "linear-gradient(135deg, #F8F8F8 0%, #1DF485 100%), linear-gradient(0deg, #F8F8F8 0%, #F8F8F8 100%)"
            : "linear-gradient(135deg, #292D4C 0%, #1DF485 100%), linear-gradient(0deg, #292D4C 0%, #292D4C 100%)",
      }}
    >
      {isBalanceLoading ? (
        <Loading className="flex items-center justify-center p-4" />
      ) : csbBalance && miraBalance ? (
        <motion.div className="py-3 inner:px-4" {...variants}>
          <div className="flex flex-row items-center justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <UserTooltip character={currentCharacter!}>
                <CharacterAvatar character={currentCharacter} size={40} />
              </UserTooltip>
              <div className="mt-[-5px] flex flex-col justify-center truncate xs:overflow-visible xs:whitespace-normal">
                <UserTooltip character={currentCharacter!}>
                  <UserName
                    name={extractCharacterName(currentCharacter)}
                    className="-mb-1 text-lg font-bold"
                    verified={false}
                  />
                </UserTooltip>
                <div className="mt-[-6px] flex items-center gap-1 opacity-50">
                  <UserTooltip character={currentCharacter!}>
                    <UserUsername
                      className="text-sm font-medium tracking-tighter"
                      username={currentCharacter?.handle ?? ""}
                    />
                  </UserTooltip>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2">
              <button
                onClick={() => {
                  selectCharactersModal.show();
                }}
              >
                <CustomIcon iconName="EllipsisIcon" />
              </button>
              <button
                onClick={() => {
                  disconnectModal.show();
                }}
              >
                <HeroIcon
                  className="w-4 h-4 stroke-current stroke-2"
                  iconName="ArrowRightOnRectangleIcon"
                />
              </button>
            </div>
          </div>
          <div className="flex flex-col items-start flex-shrink-0 pt-5 space-y-20 text-sm font-medium opacity-50">
            Token Balance
          </div>
          <div className="flex flex-col space-y-2">
            <table className="w-full">
              <tbody>
                <tr className="flex items-center">
                  <td className="w-auto">
                    <CustomIcon className="w-4 h-4" iconName="MiraIcon" />
                  </td>
                  <td className="flex-grow px-1 font-bold">
                    <span>{miraBalance.formatted} MIRA</span>
                  </td>
                  <td className="w-auto">
                    <CustomIcon className="w-4 h-4" iconName="CsbIcon" />
                  </td>
                  <td className="w-auto px-1 font-bold">
                    <span>{csbBalance.formatted.slice(0, 6)}... CSB</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <Error />
      )}
    </section>
  );
}

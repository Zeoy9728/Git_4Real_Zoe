import { SEO } from "@/components/common/seo";
import { MainContainer } from "@/components/home/main-container";
import { MainHeader } from "@/components/home/main-header";
import { HomeLayout, ProtectedLayout } from "@/components/layout/common-layout";
import { MainLayout } from "@/components/layout/main-layout";
import { Tweet } from "@/components/tweet/tweet";
import { Error } from "@/components/ui/error";
import { LoadMore } from "@/components/ui/load-more";
import { Loading } from "@/components/ui/loading";
import { useConnectedAccount } from "@crossbell/connect-kit";
import { useMintedNotesOfAddress, useNotes } from "@crossbell/indexer";
import { AnimatePresence } from "framer-motion";
import { Fragment, ReactNode, useEffect } from "react";
import {
  useAccountBalance,
  useAccountMiraBalance,
  useWalletClaimCSBModal,
  useClaimCSBStatus,
} from "@crossbell/connect-kit";
import { CustomIcon } from "@/components/ui/custom-icon";
import { Button } from "@/components/ui/button";

export default function TokenPage() {
  const { balance: csbBalance, isLoading: csbLoading } = useAccountBalance();
  const { balance: miraBalance, isLoading: miraLoading } =
    useAccountMiraBalance();
  const claimCSBModal = useWalletClaimCSBModal();
  const claimCSBStatus = useClaimCSBStatus();

  const { data, isLoading, hasNextPage, fetchNextPage, refetch } = useNotes({
    limit: 20,
  });
  const isTokensLoading = csbLoading || miraLoading;

  return (
    <MainContainer>
      <MainHeader
        useMobileSidebar
        title="Token"
        className="flex items-center justify-between border-b border-light-border text-xl dark:border-dark-border"
      >
        <hr />
        <div className="h-9"></div>
      </MainHeader>
      <Fragment>
        <section className="mt-0.5 xs:mt-0">
          {isTokensLoading ? (
            <Loading className="flex items-center justify-center p-4" />
          ) : csbBalance && miraBalance ? (
            <>
              <div className="py-2 inner:px-3">
                <h3 className="flex items-center justify-between text-lg font-bold">
                  $MIRA
                </h3>

                <div className="m-3 items-end justify-between self-stretch rounded-xl bg-gray-200 p-3 dark:bg-gray-800">
                  <div className="items-start pb-[3px] text-sm font-medium text-[#71748E]">
                    Token Balance
                  </div>
                  <div className="flex items-center justify-between pt-[3px]">
                    <div className="flex items-center">
                      <div className="h-[25px] w-[25px]">
                        <CustomIcon iconName="MiraIcon" />
                      </div>
                      <div className="pl-2 text-[24px] font-bold">
                        {miraBalance.formatted} MIRA
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() =>
                          (window.location.href = "https://mira.crossbell.io")
                        }
                        className="px-4.5 py-3.75 h-8 items-center rounded-lg border border-black dark:border-[#1DF485]"
                      >
                        <span className="mx-3 font-bold dark:text-[#1DF485]">
                          SWAP
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <p className="m-[5px] self-stretch text-xs font-medium leading-normal text-[#8D99A0]">
                  $MIRA is a precious token in the world of Crossbell and can be
                  easily exchanged on Crosschain Bridge and Uniswap. In the
                  early stages, $MIRA will be used to incentivize creators.
                </p>
                <p className="m-[5px] self-stretch text-xs font-medium leading-normal text-[#8D99A0]">
                  You can acquire $MIRA through the following ways:
                </p>
                <div className="flex justify-center border-b border-light-border pb-2 dark:border-dark-border">
                  <div className="m-1 flex h-24 w-full flex-grow items-center justify-center rounded-xl border border-[#EBEEF0] p-1 dark:border-[#343B61]">
                    <p className="text-center text-[13px] font-medium leading-normal text-[#8D99A0]">
                      Creator incentive program
                    </p>
                  </div>
                  <div className="m-1 flex h-24 w-full flex-grow items-center justify-center rounded-xl border border-[#EBEEF0] p-1 dark:border-[#343B61]">
                    <p className="text-center text-[13px] font-medium leading-normal text-[#8D99A0]">
                      Participating in events
                    </p>
                  </div>
                  <div className="m-1 flex h-24 w-full flex-grow items-center justify-center rounded-xl border border-[#EBEEF0] p-1 dark:border-[#343B61]">
                    <p className="text-center text-[13px] font-medium leading-normal text-[#8D99A0]">
                      Exchanging with USDC
                    </p>
                  </div>
                  <div className="m-1 flex h-24 w-full flex-grow items-center justify-center rounded-xl border border-[#EBEEF0] p-1 dark:border-[#343B61]">
                    <p className="text-center text-[13px] font-medium leading-normal text-[#8D99A0]">
                      Receiving tips and sponsorships from readers
                    </p>
                  </div>
                </div>
              </div>
              <div className="py-2 inner:px-3">
                <h3 className="flex items-center justify-between text-lg font-bold">
                  $CSB
                </h3>

                <div className="m-3 items-end justify-between self-stretch rounded-xl bg-gray-200 p-3 dark:bg-gray-800">
                  <div className="items-start pb-[3px] text-sm font-medium text-[#71748E]">
                    Token Balance
                  </div>
                  <div className="flex items-center justify-between pt-[3px]">
                    <div className="flex items-center">
                      <div className="h-[25px] w-[25px]">
                        <CustomIcon iconName="MiraIcon" />
                      </div>
                      <div className="pl-2 text-[24px] font-bold">
                        {csbBalance.formatted} CSB
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => claimCSBModal.show()}
                        className="px-4.5 py-3.75 h-8 items-center rounded-lg border enabled:border-black dark:border-[#1DF485] "
                      >
                        <span className="mx-3 font-bold disabled:border-gray-50 dark:text-[#1DF485]">
                          Get CSB
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <p className="m-[5px] self-stretch text-xs font-medium leading-normal text-[#8D99A0]">
                  $CSB is a token used for interactions on the Crossbell
                  blockchain and can be obtained for free from a faucet, so you
                  don&lsquo;t need to worry about its balance.
                </p>
              </div>
            </>
          ) : (
            <Error />
          )}
        </section>
      </Fragment>
    </MainContainer>
  );
}

TokenPage.getLayout = (page: ReactNode) => {
  return (
    <ProtectedLayout>
      <MainLayout>
        <HomeLayout>{page}</HomeLayout>
      </MainLayout>
    </ProtectedLayout>
  );
};

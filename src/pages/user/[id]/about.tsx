import { UserLayout, ProtectedLayout } from "@/components/layout/common-layout";
import { MainLayout } from "@/components/layout/main-layout";
import { UserDataLayout } from "@/components/layout/user-data-layout";
import { UserHomeLayout } from "@/components/layout/user-home-layout";
import { StatsEmpty } from "@/components/tweet/stats-empty";
import { ReactElement, ReactNode } from "react";
import { useRouter } from "next/router";
import { useCharacterByHandle } from "@crossbell/indexer";
import { useAccountCharacter } from "@crossbell/connect-kit";
import { Loading } from "@crossbell/ui";
import { useModal } from "@/lib/hooks/useModal";
import { Modal } from "@/components/modal/modal";
import { Input } from "@/components/input/input";
import { Button } from "@/components/ui/button";
import { preventBubbling } from "@/lib/utils";
import { usePagesOfCharacter } from "@/query/page";
import { ViewTweet } from "@/components/view/view-tweet";

export default function UserAbout(): JSX.Element {
  const { open, openModal, closeModal } = useModal();
  const {
    query: { id },
  } = useRouter();
  const { data: character, isLoading: peopleLoading } = useCharacterByHandle(
    id as string
  );
  const currentCharacter = useAccountCharacter();
  const isOwner = character?.handle === currentCharacter?.handle;

  const { data, isLoading: pageLoading } = usePagesOfCharacter(
    character?.characterId
  );

  const page = data?.pages[0]?.list[0];

  return (
    <section>
      <Modal
        className="flex items-start justify-center"
        modalClassName="bg-main-background rounded-2xl max-w-xl w-full mt-8 pt-4 overflow-hidden"
        open={open}
        closeModal={closeModal}
      >
        <Input modal page closeModal={closeModal} />
      </Modal>
      {peopleLoading || pageLoading ? (
        <div className="flex items-center w-full">
          <Loading className="mt-5" />
        </div>
      ) : !page ? (
        <>
          <StatsEmpty title={`Oooooh!`} description={`No about data yet :(`} />
          {isOwner && (
            <div className="flex flex-row items-center justify-center w-full text-sm text-main-accent">
              <Button onClick={preventBubbling(openModal)}>
                Update about page now!
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="px-4 py-3">
          <ViewTweet page tweet={page} />
        </div>
      )}
    </section>
  );
}

UserAbout.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <UserLayout>
        <UserDataLayout>
          <UserHomeLayout>{page}</UserHomeLayout>
        </UserDataLayout>
      </UserLayout>
    </MainLayout>
  </ProtectedLayout>
);

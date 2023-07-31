import { useRouter } from "next/router";
import { SEO } from "@/components/common/seo";
import { MainContainer } from "@/components/home/main-container";
import { MainHeader } from "@/components/home/main-header";
import { UserHeader } from "@/components/user/user-header";
import type { LayoutProps } from "./common-layout";
import { useCharacterByHandle } from "@crossbell/indexer";

export function UserDataLayout({ children }: LayoutProps): JSX.Element {
  const {
    query: { id },
    back,
  } = useRouter();

  const { data: character, isLoading } = useCharacterByHandle(
    (id as string) ?? undefined
  );

  return (
    <MainContainer>
      {!character && !isLoading && <SEO title="User not found / 4Real" />}
      <MainHeader useActionButton action={back}>
        <UserHeader />
      </MainHeader>
      {children}
    </MainContainer>
  );
}

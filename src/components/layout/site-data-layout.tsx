import { useRouter } from "next/router";
import { SEO } from "@/components/common/seo";
import { MainHeader } from "@/components/home/main-header";
import { UserHeader } from "@/components/user/user-header";
import type { LayoutProps } from "./common-layout";
import { useCharacterByHandle } from "@crossbell/indexer";
import { siteURL } from "@/lib/env";

export function SiteDataLayout({ children }: LayoutProps): JSX.Element {
  const {
    query: { id },
    push,
  } = useRouter();

  const { data: character, isLoading } = useCharacterByHandle(
    (id as string) ?? undefined
  );

  return (
    <main
      className={`hover-animation flex min-h-screen w-full max-w-screen-xl flex-col border-x-0
         border-light-border pb-96 dark:border-dark-border xs:border-x`}
    >
      {!character && !isLoading && <SEO title="User not found / 4Real" />}
      <MainHeader useActionButton action={() => push(`${siteURL}/user/${id}`)}>
        <UserHeader />
      </MainHeader>
      {children}
    </main>
  );
}

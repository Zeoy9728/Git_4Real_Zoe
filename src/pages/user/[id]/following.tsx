import { UserLayout, ProtectedLayout } from "@/components/layout/common-layout";
import { MainLayout } from "@/components/layout/main-layout";
import { UserDataLayout } from "@/components/layout/user-data-layout";
import { UserFollowLayout } from "@/components/layout/user-follow-layout";
import { UserFollowing as Following } from "@/components/user/user-follow";
import type { ReactElement, ReactNode } from "react";

export default function UserFollowing(): JSX.Element {
  return <Following />;
}

UserFollowing.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <UserLayout>
        <UserDataLayout>
          <UserFollowLayout>{page}</UserFollowLayout>
        </UserDataLayout>
      </UserLayout>
    </MainLayout>
  </ProtectedLayout>
);

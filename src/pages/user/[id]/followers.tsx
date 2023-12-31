import { UserLayout, ProtectedLayout } from "@/components/layout/common-layout";
import { MainLayout } from "@/components/layout/main-layout";
import { UserDataLayout } from "@/components/layout/user-data-layout";
import { UserFollowLayout } from "@/components/layout/user-follow-layout";
import { UserFollower as Follower } from "@/components/user/user-follow";
import type { ReactElement, ReactNode } from "react";

export default function UserFollowers(): JSX.Element {
  return <Follower />;
}

UserFollowers.getLayout = (page: ReactElement): ReactNode => (
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

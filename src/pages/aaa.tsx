import { HomeLayout, ProtectedLayout } from "@/components/layout/common-layout";
import { MainLayout } from "@/components/layout/main-layout";
import { ReactNode } from "react";

export default function test() {
    return <div>test</div>
}


test.getLayout = (page: ReactNode) => {
  return (
    <ProtectedLayout>
      <MainLayout>
        <HomeLayout>{page}</HomeLayout>
      </MainLayout>
    </ProtectedLayout>
  );
};
import { ReactNode, useEffect, useState } from "react";
import { Placeholder } from "../common/placeholder";
import { Aside } from "../aside/aside";
import { AsideTrends } from "../aside/aside-trends";
import { Suggestions } from "../aside/suggestions";
import { Profile } from "../aside/profile";
import { useAccountState } from "@crossbell/connect-kit";

export type LayoutProps = {
  children: ReactNode;
};

export function ProtectedLayout({ children }: LayoutProps): JSX.Element {
  const [ssrReady] = useAccountState(({ ssrReady }) => [ssrReady]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ssrReady) {
      setTimeout(() => {
        setReady(true);
      }, 1000);
    } else {
      setReady(false);
    }
  }, [ssrReady]);

  return !ready ? <Placeholder /> : <>{children}</>;
}

export function HomeLayout({ children }: LayoutProps): JSX.Element {
  return (
    <>
      {children}
      <Aside>
        <Profile />
        <AsideTrends />
        <Suggestions />
      </Aside>
    </>
  );
}

export function UserLayout({ children }: LayoutProps): JSX.Element {
  return (
    <>
      {children}
      <Aside>
        <Suggestions />
        <AsideTrends />
      </Aside>
    </>
  );
}

export function ExploreLayout({ children }: LayoutProps): JSX.Element {
  return (
    <>
      {children}
      <Aside>
        <AsideTrends />
      </Aside>
    </>
  );
}

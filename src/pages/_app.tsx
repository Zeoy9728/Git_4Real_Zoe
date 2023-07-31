import "@/styles/globals.scss";
import "@/styles/uno.css";
import "@crossbell/connect-kit/colors.css";

import { WagmiConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, createWagmiConfig } from "@crossbell/connect-kit";
import {
  NotificationModal,
  NotificationModalColorScheme,
} from "@crossbell/notification";

import { ThemeContextProvider } from "@/lib/context/theme-context";
import { AppHead } from "@/components/common/app-head";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { IpfsGatewayContext } from "@crossbell/ipfs-react";
import { IpfsGateway } from "@crossbell/ipfs-gateway";

import { Urbanist } from "next/font/google";
import { siteName } from "@/lib/env";
import Script from "next/script";

const urbanist = Urbanist({ subsets: ["latin"] });

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const colorScheme: NotificationModalColorScheme = {
  text: `inherit`,
  textSecondary: `rgb(113 118 123 / var(--tw-text-opacity))`,
  background: `rgb(var(--main-background) / var(--tw-bg-opacity))`,
  border: `rgb(47 51 54 / var(--tw-border-opacity))`,
};

const queryClient = new QueryClient();
const wagmiConfig = createWagmiConfig({ appName: siteName });

export const ipfsGateway = new IpfsGateway();

export default function App({
  Component,
  pageProps,
}: AppPropsWithLayout): ReactNode {
  const getLayout = Component.getLayout ?? ((page): ReactNode => page);

  return (
    <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-9LVBWBZHPQ" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-9LVBWBZHPQ');
        `}
      </Script>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={wagmiConfig}>
          <IpfsGatewayContext.Provider value={ipfsGateway}>
            <ConnectKitProvider>
              <AppHead />
              <ThemeContextProvider>
                <NotificationModal colorScheme={colorScheme} />
                <main className={urbanist.className}>
                  {getLayout(<Component {...pageProps} />)}
                </main>
              </ThemeContextProvider>
            </ConnectKitProvider>
          </IpfsGatewayContext.Provider>
        </WagmiConfig>
      </QueryClientProvider>
    </>
  );
}

import Head from "next/head";

export function AppHead(): JSX.Element {
  return (
    <Head>
      <title>4Real</title>
      <meta name="og:title" content="Twitter" />
      <link rel="icon" href="/favicon.ico" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}

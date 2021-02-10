import "../styles/globals.css";

import type { AppProps } from "next/app";

import { PageHeader } from "src/components/PageHeader";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <PageHeader />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;

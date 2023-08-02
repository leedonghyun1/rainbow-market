import React from "react";
import "../styles/globals.css";
import { SWRConfig } from "swr";
import Script from "next/script";
import { AppProps } from "next/app";
import { SessionProvider} from "next-auth/react";


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <SWRConfig
        value={{
          fetcher: (url: string) =>
            fetch(url).then((response) => response.json()),
        }}
      >
        <div className="w-full mx-auto max-w-2xl">
          <Component {...pageProps} />
        </div>
      </SWRConfig>
    </SessionProvider>
  );
}

export default MyApp;

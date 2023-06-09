import React from "react";
import "../styles/globals.css";
import { SWRConfig } from "swr";

function MyApp({ Component, pageProps }) {
  console.log("app is running")
  return (
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
  );
}

export default MyApp;

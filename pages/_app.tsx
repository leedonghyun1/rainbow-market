import React from "react";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <div className="w-full mx-auto max-w-2xl">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;

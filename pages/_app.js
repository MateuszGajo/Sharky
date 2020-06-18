import React, { useEffect } from "react";

const MyApp = ({ Component, pageProps }) => {
  useEffect(() => {}, []);

  return <Component {...pageProps} />;
};

export default MyApp;

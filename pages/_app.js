import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import AppContext from "../features/context/AppContext";
import { SERVER_URL } from "../config/config";
import { getOwner } from "../features/service/Functions/index";

const MyApp = ({ Component, pageProps }) => {
  const socket = socketIOClient(SERVER_URL);
  const [owner, setOwner] = useState({});

  useEffect(() => {
    getOwner(setOwner);
  }, []);
  return (
    <AppContext.Provider
      value={{
        socket,
        owner,
      }}
    >
      <Component {...pageProps} />
    </AppContext.Provider>
  );
};

export default MyApp;

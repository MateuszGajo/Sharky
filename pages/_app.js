import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import AppContext from "../features/context/AppContext";
import { SERVER_URL } from "../config/config";
import { getOwner } from "../features/service/Functions/index";
let socket;
const MyApp = ({ Component, pageProps }) => {
  const [owner, setOwner] = useState({});
  const [newMessage, setNewMessage] = useState({});
  const [isBadRequest, setStatusOfBadRequest] = useState(true);

  useEffect(() => {
    getOwner(setOwner);
  }, []);

  useEffect(() => {
    socket = socketIOClient(SERVER_URL);
    socket.on(
      "message",
      ({ idMessage, idChat, idUser, message, date, messageTo }) => {
        setNewMessage({ idMessage, idChat, idUser, message, date, messageTo });
      }
    );
  }, [SERVER_URL]);

  return (
    <AppContext.Provider
      value={{
        socket,
        owner,
        newMessage,
        isBadRequest,
        setStatusOfBadRequest,
      }}
    >
      <Component {...pageProps} />
    </AppContext.Provider>
  );
};

export default MyApp;

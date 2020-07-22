import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import AppContext from "@features/context/AppContext";
import { SERVER_URL } from "../config/config";
import { getOwner } from "@features/service/functions/index";
let socket;
const MyApp = ({ Component, pageProps }) => {
  const [owner, setOwner] = useState({});
  const [newMessage, setNewMessage] = useState({});
  const [isError, setStatusOfError] = useState("");
  const [isPrompt, setPrompt] = useState(
    "Message bardzo długa wiadomosc az sie nie miesci, a ty dalej ja miescisz hmmm"
  );

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
        isError,
        isPrompt,
        setPrompt,
        setStatusOfError,
      }}
    >
      <Component {...pageProps} />
    </AppContext.Provider>
  );
};

export default MyApp;

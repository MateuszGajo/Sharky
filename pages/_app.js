import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import AppContext from "@features/context/AppContext";
import { SERVER_URL } from "../config/config";
let socket = socketIOClient(SERVER_URL);
const MyApp = ({ Component, pageProps }) => {
  const [owner, setOwner] = useState({ id: null });
  const [newMessage, setNewMessage] = useState({});
  const [newChat, setNewChat] = useState({
    idUser: null,
    idChat: null,
    messageTo: null,
    firstName: "",
    lastName: "",
    photo: "",
  });
  const [isError, setError] = useState("");
  const [isPrompt, setPrompt] = useState("");

  useEffect(() => {
    if (owner.id) {
      socket = socketIOClient(SERVER_URL);
      socket.on(
        "message",
        ({ idMessage, idChat, idUser, message, date, messageTo }) => {
          setNewMessage({
            idMessage,
            idChat,
            idUser,
            message,
            date,
            messageTo,
          });
        }
      );

      socket.on("newChat", ({ newChat }) => {
        setNewChat(newChat);
      });

      socket.emit("connectUser");
    }
  }, [owner]);

  return (
    <AppContext.Provider
      value={{
        socket,
        owner,
        setOwner,
        newMessage,
        isError,
        isPrompt,
        setPrompt,
        setError,
        newChat,
        setNewChat,
      }}
    >
      <Component {...pageProps} />
    </AppContext.Provider>
  );
};

export default MyApp;

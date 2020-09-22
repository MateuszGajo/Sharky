import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import AppContext from "@features/context/AppContext";
import { SERVER_URL } from "../config/config";

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
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (owner.id) {
      setSocket(socketIOClient(SERVER_URL));
    }
  }, [owner]);

  useEffect(() => {
    if (socket) {
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
  }, [socket]);

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

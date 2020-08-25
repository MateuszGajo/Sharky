import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import socketIOClient from "socket.io-client";
import AppContext from "@features/context/AppContext";
import { SERVER_URL } from "../config/config";
import { getOwner } from "@features/service/functions/index";
let socket;
const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const [owner, setOwner] = useState({});
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

    socket.on("newChat", ({ newChat }) => {
      setNewChat(newChat);
    });

    socket.on("logOutChangedPassword", () => {
      axios.get("/user/logout").then(() => {
        router.push("/signin");
      });
    });
    socket.emit("connectUser");
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

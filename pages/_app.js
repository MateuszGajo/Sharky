import React, { useEffect, useState, useReducer } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import socketIOClient from "socket.io-client";
import AppContext from "@features/context/AppContext";
import { SERVER_URL } from "../config/config";
import AuthReducer from "@features/context/authReducer";
import { authInitState } from "@features/context/initState";
import { checkLanguage } from "@features/service/Functions";

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
  const [authError, setAuthError] = useState("");
  const [authUserError, setAuthUserError] = useState("");
  const [validationSignUpError, setValidationSignUpError] = useState("");
  const [socket, setSocket] = useState(null);

  const [state, dispatch] = useReducer(AuthReducer, authInitState);
  useEffect(() => {
    if (owner.id) {
      setSocket(socketIOClient(SERVER_URL));
      checkLanguage({ idUser: owner.id });
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
        authError,
        setAuthError,
        authUserError,
        setAuthUserError,
        validationSignUpError,
        setValidationSignUpError,
        dispatch,
        ...state,
      }}
    >
      <Component {...pageProps} />
    </AppContext.Provider>
  );
};

export default MyApp;

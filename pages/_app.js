import React, { useEffect, useState, useReducer } from "react";
import socketIOClient from "socket.io-client";
import AppContext from "@features/context/AppContext";
import { SERVER_URL } from "../config/config";
import AuthReducer from "@features/context/authReducer";
import { authInitState } from "@features/context/initState";
let socket;
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
  const [isAuth, setStatusOfAuth] = useState(null);
  const [authError, setAuthError] = useState("");
  const [authUserError, setAuthUserError] = useState("");
  const [validationSignUpError, setValidationSignUpError] = useState("");

  const [state, dispatch] = useReducer(AuthReducer, authInitState);

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
  }, [SERVER_URL]);

  useEffect(() => {
    owner.id && socket.emit("connectUser");
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
        isAuth,
        setStatusOfAuth,
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

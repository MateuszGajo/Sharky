import React, { useEffect, useState, useReducer } from "react";
import socketIOClient from "socket.io-client";
import Router from "next/router";
import PropTypes from "prop-types";
import axios from "~features/service/Axios";
import AppContext from "~features/context/AppContext";
import { SERVER_URL } from "../config/config";
import AuthReducer from "~features/context/authReducer";
import { authInitState } from "~features/context/initState";
import { checkLanguage } from "~features/service/Functions";

const MyApp = ({ Component, pageProps }) => {
  const [owner, setOwner] = useState({});
  const [newMessage, setNewMessage] = useState({});
  const [newChat, setNewChat] = useState({
    userId: null,
    chatId: null,
    messageTo: null,
    firstName: "",
    lastName: "",
    photo: "",
  });
  const [report, setReport] = useState({
    type: "",
    id: null,
  });

  const [isError, setError] = useState("");
  const [isPrompt, setPrompt] = useState("");
  const [authError, setAuthError] = useState("");
  const [authUserError, setAuthUserError] = useState("");
  const [confirmPopUpError, setConfirmPopUpError] = useState("");
  const [photoPopUp, setPhotoPopUp] = useState({
    photoSrc: null,
    postId: null,
    forward: false,
  });
  const [validationSignUpError, setValidationSignUpError] = useState("");
  const [socket, setSocket] = useState(null);

  const [state, dispatch] = useReducer(AuthReducer, authInitState);
  useEffect(() => {
    if (owner.id) {
      setSocket(socketIOClient(SERVER_URL));
      checkLanguage();
    }
  }, [owner]);

  useEffect(() => {
    if (socket) {
      socket.on(
        "message",
        ({ messageId, chatId, userId, message, date, messageTo }) => {
          setNewMessage({
            messageId,
            chatId,
            userId,
            message,
            date,
            messageTo,
          });
        }
      );

      socket.on("newChat", ({ initialNewChat }) => {
        setNewChat(initialNewChat);
      });

      socket.on("changePasswordError", ({ message }) => {
        setConfirmPopUpError(message);
      });

      socket.on("passwordChanged", async () => {
        axios.get("/user/logout").then(() => {
          Router.push("/");
        });
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
        report,
        setReport,
        newChat,
        setNewChat,
        authError,
        photoPopUp,
        setPhotoPopUp,
        setAuthError,
        authUserError,
        setAuthUserError,
        confirmPopUpError,
        setConfirmPopUpError,
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

MyApp.defaultProps = {
  Component: () => {},
  pageProps: {},
};

MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.objectOf(PropTypes.any),
};

export default MyApp;

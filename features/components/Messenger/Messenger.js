import React, { useEffect, useState, useContext } from "react";
import cx from "classnames";
import Navbar from "./components/Navbar/Navbar";
import Content from "./components/Content/Content";
import Downbar from "./components/Downbar/Downbar";
import Spinner from "../Spinner/Spinner";
import { getMesseges } from "./services/functions/index";
import AppContext from "../../context/AppContext";

const Messenger = ({
  setStatusOfMessenger = null,
  isMessengerClose = false,
  windowMessenger = false,
  setStatusOfDisplayMobile,
  chat,
}) => {
  const { newMessage } = useContext(AppContext);

  const [isLoading, setStatusOfLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({ id: null });

  useEffect(() => {
    if (newMessage.idChat == chat.idChat) {
      setMessages([
        ...messages,
        {
          id: chat.idChat,
          idChat: newMessage.idChat,
          message: newMessage.message,
          date: newMessage.date,
          idUser: user.id,
        },
      ]);
    }
  }, [newMessage]);

  useEffect(() => {
    const { idChat } = chat;
    if (user.id !== chat.user.id) {
      getMesseges({
        idChat: idChat,
        messages: [],
        setMessages,
        setStatusOfLoading,
      });
      setUser(chat.user);
    }
  }, [chat.idChat]);
  if (isLoading) return <Spinner />;
  return (
    <div
      className={cx("messenger", {
        "is-close": isMessengerClose,
        "window-messanger": windowMessenger === true,
      })}
      data-testid="messenger"
    >
      <Navbar
        setStatusOfDisplayMobile={setStatusOfDisplayMobile}
        setStatusOfMessenger={setStatusOfMessenger}
        messages={messages}
        user={user}
        windowMessenger={windowMessenger}
      />
      <Content messages={messages} user={user} />
      <Downbar
        idChat={chat.idChat}
        messages={messages}
        setMessages={setMessages}
        converser={user.id}
      />
    </div>
  );
};

export default Messenger;

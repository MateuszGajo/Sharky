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
    if (newMessage.idChat == 2) {
      setMessages([
        ...messages,
        {
          id: 1,
          idChat: newMessage.idChat,
          message: newMessage.message,
          date: newMessage.date,
          idUser: user.id,
        },
      ]);
    }
  }, [newMessage]);
  console.log(newMessage);
  useEffect(() => {
    if (user.id !== chat.user.id) {
      getMesseges({
        idChat: chat.idChat,
        messages: [],
        setMessages,
        setStatusOfLoading,
      });
      setUser(chat.user);
    }
  }, [chat.user]);
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
      />
    </div>
  );
};

export default Messenger;

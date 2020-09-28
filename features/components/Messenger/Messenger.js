import React, { useEffect, useState, useContext } from "react";
import cx from "classnames";
import Navbar from "./components/Navbar/Navbar";
import Content from "./components/Content/Content";
import Downbar from "./components/Downbar/Downbar";
import Spinner from "@components/Spinner/Spinner";
import { getMesseges } from "./services/Functions";
import AppContext from "@features/context/AppContext";

const Messenger = ({
  setStatusOfMessenger = null,
  isMessengerClose = false,
  windowMessenger = false,
  setStatusOfDisplayMobile,
  chat,
  setChat,
}) => {
  const { newMessage } = useContext(AppContext);

  const [isLoading, setStatusOfLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({ id: null });

  useEffect(() => {
    if (newMessage.chatId == chat.chatId) {
      setMessages([
        ...messages,
        {
          id: chat.chatId,
          chatId: newMessage.chatId,
          message: newMessage.message,
          date: newMessage.date,
          userId: newMessage.userId,
        },
      ]);
    }
  }, [newMessage]);

  useEffect(() => {
    const { chatId } = chat;
    if (user.id !== chat.user.id) {
      getMesseges({
        chatId: chatId,
        messages: [],
        setMessages,
        setStatusOfLoading,
      });
      setUser(chat.user);
    }
  }, [chat.chatId]);

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
        setChat={setChat}
      />
      {isLoading ? <Spinner /> : <Content messages={messages} user={user} />}
      <Downbar
        chatId={chat.chatId}
        messages={messages}
        setMessages={setMessages}
        converser={user.id}
      />
    </div>
  );
};

export default Messenger;

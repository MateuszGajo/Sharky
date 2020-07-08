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
  conversation = {
    id: 1212,
    type: "group",
    name: "Grupowa konwersacja",
    photo: "group",
    members: [123, 124, 125],
  },
}) => {
  const { socket } = useContext(AppContext);

  const [isLoading, setStatusOfLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({ id: null });

  useEffect(() => {
    socket.on("message", ({ message, date }) => {
      setMessages((messages) => [
        ...messages,
        { idUser: user.id, message, date },
      ]);
    });
  }, []);

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

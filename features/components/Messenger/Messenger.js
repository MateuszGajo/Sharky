import React, { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import Navbar from "./components/NavBar/NavBar";
import Content from "./components/Content/Content";
import Downbar from "./components/Downbar/Downbar";
import Spinner from "~components/Spinner/Spinner";
import { getMesseges } from "./services/Functions";
import AppContext from "~features/context/AppContext";

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
  const [scrollDown, setScrollDown] = useState(0);

  useEffect(() => {
    if (newMessage.chatId === chat.chatId) {
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
      setScrollDown((prev) => prev + 1);
    }
  }, [newMessage]);

  useEffect(() => {
    const {
      user: { id },
    } = chat;

    if (user.id !== chat.user.id) {
      getMesseges({
        userId: id,
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
        user={user}
        windowMessenger={windowMessenger}
        setChat={setChat}
      />
      {isLoading ? (
        <Spinner />
      ) : (
        <Content
          messages={messages}
          user={user}
          chat={chat}
          scrollDown={scrollDown}
        />
      )}
      <Downbar
        chatId={chat.chatId}
        messages={messages}
        setMessages={setMessages}
        converser={user.id}
      />
    </div>
  );
};

Messenger.defaultProps = {
  windowMessenger: false,
  setStatusOfDisplayMobile: () => {},
};

Messenger.propTypes = {
  setStatusOfMessenger: PropTypes.func.isRequired,
  isMessengerClose: PropTypes.bool.isRequired,
  windowMessenger: PropTypes.bool,
  setStatusOfDisplayMobile: PropTypes.func,
  chat: PropTypes.shape({
    chatId: PropTypes.number,
    user: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      photo: PropTypes.string,
    }),
  }).isRequired,
  setChat: PropTypes.func.isRequired,
};

export default Messenger;

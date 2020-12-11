import React, { useState } from "react";
import PropTypes from "prop-types";
import { WizzardContext } from "./context/WizzardContext";
import NavBar from "./components/NavBar/NavBar";
import Main from "./components/Main/Main";
import FriendsBar from "./components/FriendsBar/FriendsBar";
import Messager from "./components/Messenger/Messenger";
import Wrapper from "./components/Wrapper/Wrapper";

const Wizzard = ({ children }) => {
  const [isMessengerClose, setStatusOfMessenger] = useState(true);
  const [chat, setChat] = useState({ user: {}, chatId: null });
  const [postContent, setPostContent] = useState("");

  return (
    <WizzardContext.Provider
      value={{
        isMessengerClose,
        setStatusOfMessenger,
        postContent,
        setPostContent,
        chat,
        setChat,
      }}
    >
      {children}
    </WizzardContext.Provider>
  );
};

Wizzard.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

export { Wizzard, Wrapper, NavBar, Main, FriendsBar, Messager };

import React, { useState, useRef, useEffect } from "react";
import { WizzardContext } from "./context/WizzardContext";
import NavBar from "./components/NavBar/Navbar";
import Main from "./components/Main/Main";
import FriendsBar from "./components/FriendsBar/FriendsBar";
import Messager from "./components/Messenger/Messenger";
import Wrapper from "./components/Wrapper/Wrapper";

const Wizzard = ({ children }) => {
  const [isMessengerClose, setStatusOfMessenger] = useState(true);
  const [chat, setChat] = useState({ user: {}, idChat: null });
  const [searchContent, setSearchContent] = useState("");
  const [postContent, setPostContent] = useState("");
  const [isNavOpen, setStatusOfNav] = useState(false);

  return (
    <WizzardContext.Provider
      value={{
        isMessengerClose,
        setStatusOfMessenger,
        searchContent,
        setSearchContent,
        postContent,
        setPostContent,
        isNavOpen,
        setStatusOfNav,
        chat,
        setChat,
      }}
    >
      {children}
    </WizzardContext.Provider>
  );
};

export { Wizzard, Wrapper, NavBar, Main, FriendsBar, Messager };

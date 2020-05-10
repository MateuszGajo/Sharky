import React, { useState } from "react";
import { WizzardContext } from "./context/WizzardContext";
import NavBar from "./components/NavBar/Navbar";
import Main from "./components/Main/Main";
import FriendsBar from "./components/FriendsBar/FriendsBar";
import Messager from "./components/Messenger/Messenger";

const Wizzard = ({ children }) => {
  const [isMessengerClose, setStatusOfMessenger] = useState(false);
  const [searchContent, setSearchContent] = useState("");
  const [postContent, setPostContent] = useState("");
  return (
    <WizzardContext.Provider
      value={{
        isMessengerClose,
        setStatusOfMessenger,
        searchContent,
        setSearchContent,
        postContent,
        setPostContent,
      }}
    >
      <section className="home-wrapper">{children}</section>
    </WizzardContext.Provider>
  );
};

export { Wizzard, NavBar, Main, FriendsBar, Messager };

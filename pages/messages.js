import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Router from "next/router";
import NavBar from "../features/components/Layout/Home/Compound/components/NavBar/Navbar";
import Messenger from "../features/components/Messenger/Messenger";
import Conversations from "../features/components/Messages/Conversations/Conversations";
import Spinner from "@components/Spinner/Spinner";
import AppContext from "@features/context/AppContext";
import { getOwner } from "@features/service/Functions/index";
import "../styles/main.scss";

const Messages = () => {
  const { socket, setOwner, isAuth, setStatusOfAuth } = useContext(AppContext);

  const [conversations, setConversations] = useState([]);
  const [chat, setChat] = useState({});
  const [isMessengerOpen, setStatusOfMessenger] = useState(false);
  const [isLoading, setStatusOfLoading] = useState(true);

  useEffect(() => {
    if (conversations.length) socket.emit("joinChat");
  }, [conversations]);

  useEffect(() => {
    isAuth &&
      axios
        .get("/message/conversation/get")
        .then(({ data: { conversations } }) => {
          const {
            idUser,
            firstName,
            lastName,
            photo,
            idChat,
          } = conversations[0];
          setChat({
            user: {
              id: idUser,
              firstName,
              lastName,
              photo,
            },
            idChat,
          });
          setConversations(conversations);
          setStatusOfLoading(false);
        });
  }, [isAuth]);

  useEffect(() => {
    getOwner({ setStatusOfAuth, setOwner });
  }, []);

  if (isAuth == null) return <Spinner />;
  else if (!isAuth) {
    Router.push("/signin");
    return <Spinner />;
  } else if (isLoading) return <Spinner />;
  return (
    <section className="messages">
      <NavBar />
      <div className="messages__container messages__container--desktop">
        <Conversations items={conversations} setChat={setChat} chat={chat} />
        <div className="messages__container__display">
          <Messenger chat={chat} />
        </div>
      </div>
      <div className="messages__container messages__container--mobile">
        <Conversations items={conversations} setChat={setChat} chat={chat} />
        <div className="messages__container__display--mobile">
          <Messenger chat={chat} />
        </div>
      </div>
    </section>
  );
};

export default Messages;

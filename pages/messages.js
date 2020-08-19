import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import NavBar from "../features/components/Layout/Home/Compound/components/NavBar/Navbar";
import Messenger from "../features/components/Messenger/Messenger";
import Conversations from "../features/components/Messages/Conversations/Conversations";
import Spinner from "@components/Spinner/Spinner";
import AppContext from "@features/context/AppContext";
import "../styles/main.scss";

const Messages = () => {
  const { socket } = useContext(AppContext);

  const [conversations, setConversations] = useState([]);
  const [chat, setChat] = useState({});
  const [isMessengerOpen, setStatusOfMessenger] = useState(false);
  const [isLoading, setStatusOfLoading] = useState(true);

  useEffect(() => {
    if (conversations.length) socket.emit("joinChat");
  }, [conversations]);

  useEffect(() => {
    axios
      .get("/message/conversation/get")
      .then(({ data: { conversations } }) => {
        const { idUser, firstName, lastName, photo, idChat } = conversations[0];
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
  }, []);

  if (isLoading) return <Spinner />;
  return (
    <section className="messages">
      <NavBar />
      <div className="messages__container messages__container--desktop">
        <Conversations items={conversations} setChat={setChat} chat={chat} />
        <div className="messages__container__display">
          <Messenger chat={chat} />
        </div>
      </div>
      {/* <div className="messages__container messages__container--mobile">
        {!conversation ? (
          <Conversations items={conversations} setItem={setConversation} />
        ) : (
          <div className="messages__container__display--mobile">
            <Messenger
              conversation={
                conversation === null ? conversations[0] : conversation
              }
            />
          </div>
        )}
      </div> */}
    </section>
  );
};

export default Messages;

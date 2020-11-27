import React, { useState, useEffect, useContext } from "react";
import axios from "@features/service/Axios";
import Router from "next/router";
import NavBar from "@components/Layout/Home/Compound/components/NavBar/NavBar";
import Messenger from "@components/Messenger/Messenger";
import Conversations from "@components/Messages/Conversations/Conversations";
import Spinner from "@components/Spinner/Spinner";
import AppContext from "@features/context/AppContext";
import PopUpHandlers from "@components/PopUpHandlers/PopUpHandlers";
import { getOwner } from "@features/service/Functions/index";
import i18next from "@i18n";
import "../styles/messages.scss";
const { useTranslation } = i18next;

const Messages = () => {
  const { socket, setOwner } = useContext(AppContext);

  const { t } = useTranslation(["messages"]);

  const noFriends = t("messages:no-friends");

  const [conversations, setConversations] = useState([]);
  const [chat, setChat] = useState({ chatId: null });
  const [isLoading, setStatusOfLoading] = useState(true);
  const [isAuth, setStatusOfAuth] = useState(null);
  const [isDisplayMobile, setStatusOfDisplayMobile] = useState(false);

  useEffect(() => {
    if (conversations.length) socket.emit("joinChat");
  }, [conversations]);

  useEffect(() => {
    isAuth &&
      axios
        .get("/message/conversation/get")
        .then(({ data: { conversations } }) => {
          if (conversations.length) {
            const {
              userId,
              firstName,
              lastName,
              photo,
              chatId,
            } = conversations[0];
            setChat({
              user: {
                id: userId,
                firstName,
                lastName,
                photo,
              },
              chatId,
            });
            setConversations(conversations);
          }
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
      <PopUpHandlers />
      <NavBar />
      {chat.chatId ? (
        <>
          <div className="messages__container messages__container--desktop">
            <Conversations
              items={conversations}
              setChat={setChat}
              chat={chat}
              setStatusOfDisplayMobile={setStatusOfDisplayMobile}
            />
            <div className="messages__container__display">
              <Messenger
                chat={chat}
                setChat={setChat}
                setStatusOfDisplayMobile={setStatusOfDisplayMobile}
              />
            </div>
          </div>
          <div className="messages__container messages__container--mobile">
            {!isDisplayMobile ? (
              <Conversations
                items={conversations}
                setChat={setChat}
                chat={chat}
                setStatusOfDisplayMobile={setStatusOfDisplayMobile}
              />
            ) : (
              <div className="messages__container__display--mobile">
                <Messenger
                  chat={chat}
                  setChat={setChat}
                  setStatusOfDisplayMobile={setStatusOfDisplayMobile}
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="messages__empty">{noFriends}</div>
      )}
    </section>
  );
};

export default Messages;

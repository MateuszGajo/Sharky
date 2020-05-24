import React, { useState } from "react";
import NavBar from "../features/components/Layout/Home/Compound/components/NavBar/Navbar";
import Messenger from "../features/components/Messenger/Messenger";
import Conversations from "../features/components/Messages/Conversations/Conversations";
import "../styles/main.scss";

const Messages = ({
  conversations = [
    {
      id: 2,
      type: "group",
      name: "Konwersacja grupowa",
      photo: "group",
      members: [123, 124, 125],
      messages: [
        {
          idUser: 123,
          message: "Lorem",
          data: new Date(),
        },
        {
          idUser: 123,
          message: "Lorem",
          data: new Date(),
        },
        {
          idUser: 123,
          message: "Lorem",
          data: new Date(),
        },
        {
          idUser: 123,
          message: "Lorem",
          data: new Date(),
        },
        {
          idUser: 124,
          message:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolore, maiores tempora repellendus accusantium consectetur quasi itaque suscipit, veritatis inventore ea ad odio eaque doloremque neque voluptas ab. Quis, facere.",
          data: new Date(),
        },
        {
          idUser: 124,
          message:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolore, maiores tempora repellendus accusantium consectetur quasi itaque suscipit, veritatis inventore ea ad odio eaque doloremque neque voluptas ab. Quis, facere.",
          data: new Date(),
        },
        {
          idUser: 124,
          message:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolore, maiores tempora repellendus accusantium consectetur quasi itaque suscipit, veritatis inventore ea ad odio eaque doloremque neque voluptas ab. Quis, facere.",
          data: new Date(),
        },
        {
          idUser: 123,
          message:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam doloremque ea excepturi distinctio aspernatur voluptatibus illum dignissimos necessitatibus natus officiis cumque nesciunt minus molestiae fugit, optio expedita consequatur vero ut!",
          data: new Date(),
        },
        {
          idUser: 123,
          message: "Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem",
          data: new Date(),
        },
      ],
    },
    {
      id: 2,
      type: "group",
      name: "Konwersacja grupowa",
      photo: "group",
      members: [123, 124, 125],
      messages: [
        {
          idUser: 123,
          message: "Lorem",
          date: new Date(),
        },
      ],
    },
    {
      id: 3,
      type: "single",
      name: "Jan Kowalski",
      photo: "profile.png",
      members: [123, 124],
      messages: [
        {
          idUser: 123,
          message: "Lorem",
          date: new Date(),
        },
      ],
    },
  ],
  users = {
    123: {
      id: 123,
      firstName: "Jan",
      lastName: "Kowalski",
      photo: "profile.png",
    },
    124: {
      id: 124,
      firstName: "Franek",
      lastName: "Błaszczykowski",
      photo: "profile.png",
    },
    125: {
      id: 125,
      firstName: "Franek",
      lastName: "Błaszczykowski",
      photo: "profile.png",
    },
  },
}) => {
  const [conversation, setConversation] = useState(null);
  const [isMessengerOpen, setStatusOfMessenger] = useState(false);
  return (
    <section className="messages">
      <NavBar />
      <div className="messages__container messages__container--desktop">
        <Conversations items={conversations} setItem={setConversation} />
        <div className="messages__container__display">
          <Messenger
            conversation={
              conversation === null ? conversations[0] : conversation
            }
          />
        </div>
      </div>
      <div className="messages__container messages__container--mobile">
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
      </div>
    </section>
  );
};

export default Messages;

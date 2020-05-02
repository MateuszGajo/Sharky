import React from "react";
import NavBar from "../features/components/Layout/Home/Compound/components/NavBar/Navbar";
import Messenger from "../features/components/Messenger/Messenger";

const Messages = ({
  conversations = [
    {
      id: 2,
      type: "group",
      name: "Konwersacja grupowa",
      photo: "group.png",
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
      photo: "group.png",
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
  return (
    <section className="messages">
      <NavBar />
      <div className="messages__container">
        <div className="messages__container__conversations">
          {conversations.map((conversation) => {
            return (
              <div
                className="messages__container__conversations__item"
                key={conversation.id}
              >
                <div className="messages__container__conversations__item__photo">
                  <img
                    src={"/static/images/" + conversation.photo}
                    alt=""
                    className="messages__container__conversations__item__photo--img"
                  />
                </div>
                <div className="messages__container__conversations__item__content">
                  <div className="messages__container__conversations__item__content--name">
                    <span className="messages__container__conversations__item__content--name--span">
                      {conversation.name}
                    </span>
                  </div>
                  <div className="messages__container__conversations__item__content--last-message">
                    <span className="messages__container__conversations__item__content--last-message--span">
                      {
                        conversation.messages[conversation.messages.length - 1]
                          .message
                      }
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="messages__container__display">
          <Messenger />
        </div>
      </div>
    </section>
  );
};

export default Messages;

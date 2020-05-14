import React, { useState, useRef, useEffect } from "react";
import { MdSend } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { MdGroup } from "react-icons/md";
import { IconContext } from "react-icons";
import cx from "classnames";
import Router from "../../routes";

// import { WizzardContext } from "../../context/WizzardContext";

const Messenger = ({
  isMessengerClose = false,
  setStatusOfMessenger = null,
  windowMessenger = false,
  conversation = {
    id: 1212,
    type: "group",
    name: "Grupowa konwersacja",
    photo: "group",
    members: [123, 124, 125],
    messages: [
      {
        idUser: 123,
        message: "Lorem",
        date: new Date(),
      },
      {
        idUser: 123,
        message: "Lorem",
        date: new Date(),
      },
      {
        idUser: 123,
        message: "Lorem",
        date: new Date(),
      },
      {
        idUser: 123,
        message: "Lorem",
        date: new Date(),
      },
      {
        idUser: 124,
        message:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolore, maiores tempora repellendus accusantium consectetur quasi itaque suscipit, veritatis inventore ea ad odio eaque doloremque neque voluptas ab. Quis, facere.",
        date: new Date(),
      },
      {
        idUser: 124,
        message:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolore, maiores tempora repellendus accusantium consectetur quasi itaque suscipit, veritatis inventore ea ad odio eaque doloremque neque voluptas ab. Quis, facere.",
        date: new Date(),
      },
      {
        idUser: 124,
        message:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolore, maiores tempora repellendus accusantium consectetur quasi itaque suscipit, veritatis inventore ea ad odio eaque doloremque neque voluptas ab. Quis, facere.",
        date: new Date(),
      },
      {
        idUser: 123,
        message:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam doloremque ea excepturi distinctio aspernatur voluptatibus illum dignissimos necessitatibus natus officiis cumque nesciunt minus molestiae fugit, optio expedita consequatur vero ut!",
        date: new Date(),
      },
      {
        idUser: 123,
        message: "Lorem",
        date: new Date(),
      },
    ],
  },
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
  },
  user = {
    id: 123,
    firstName: "Jan",
    lastName: "Kowalski",
    photo: "profile.png",
  },
  onSubmit,
}) => {
  const messageArea = useRef(null);
  const messageForm = useRef(null);
  const [messageContent, setMessageContent] = useState("");
  const [userInfo, setUserInfo] = useState({ id: user.id });

  useEffect(() => {
    messageArea.current.addEventListener("keydown", function textAreaSubmit(e) {
      if (e.keyCode == 13) {
        messageForm.current.dispatchEvent(new Event("submit"));
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(messageContent);
  };

  return (
    <div
      className={cx("messenger", {
        "is-close": isMessengerClose,
        "window-messanger": windowMessenger === true,
      })}
      data-testid="messenger"
    >
      <div className="messenger__navbar">
        <div className="messenger__navbar__person">
          {conversation.photo === "group" ? (
            <div className="messenger__navbar__person__icon">
              <IconContext.Provider
                value={{
                  className: "messenger__navbar__person__icon--group",
                }}
              >
                <MdGroup />
              </IconContext.Provider>
            </div>
          ) : (
            <div className="messenger__navbar__person__photo">
              <img
                src={"/static/images/" + conversation.photo}
                alt=""
                className="messenger__navbar__person__photo--img"
              />
            </div>
          )}

          <div className="messenger__navbar__person--name">
            <span className="messenger__navbar__person--name--text">
              {conversation.name}
            </span>
          </div>
        </div>
        {windowMessenger ? (
          <div className="messenger__navbar__icons">
            <div
              className="messenger__navbar__icons--icon"
              onClick={() => setStatusOfMessenger(true)}
              data-testid="messenger-close"
            >
              <AiOutlineClose />
            </div>
          </div>
        ) : null}
      </div>
      <div className="messenger__text" data-testid="messenger-chat">
        {conversation.messages.map((item, index) => {
          const addAuthor =
            index + 1 === conversation.messages.length ||
            conversation.messages[index + 1].idUser !== item.idUser;
          const user = users[item.idUser];

          return item.idUser === userInfo.id ? (
            <div className="messenger__text--myself" key={index}>
              <span className="messenger__text--myself--primary-color messenger-text-style">
                {item.message}
              </span>
            </div>
          ) : (
            <div className="messenger__text--stranger" key={index}>
              <span className="messenger__text--stranger--primary-background-color messenger-text-style">
                {item.message}
              </span>
              {addAuthor ? (
                <div className="messenger__text--stranger__user">
                  <div
                    className="messenger__text--stranger__user__container"
                    title={user.firstName + " " + user.lastName}
                    onClick={() =>
                      Router.pushRoute("profile", { id: item.idUser })
                    }
                  >
                    <div className="messenger__text--stranger__user__container__photo">
                      <img
                        src={"/static/images/" + user.photo}
                        alt=""
                        className="messenger__text--stranger__user__container__photo--img"
                      />
                    </div>
                    <div className="messenger__text--stranger__user__container__name">
                      <span className="messenger__text--stranger__user__container__name--span">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="messenger__downbar">
        <form
          onSubmit={handleSubmit}
          ref={messageForm}
          className="messenger__downbar__form"
        >
          <div className="messenger__downbar__form__text">
            <textarea
              ref={messageArea}
              type="text"
              className="messenger__downbar__form__text--textarea"
              placeholder="Napisz wiadomość"
              data-testid="messenger-text"
              onChange={(e) => setMessageContent(e.target.value)}
            />
          </div>
          <div className="messenger__downbar__form__send">
            <button
              className="messenger__downbar__form__send--buton"
              data-testid="messenger-send-button"
            >
              <MdSend />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Messenger;

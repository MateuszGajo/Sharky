import React, { useState, useRef, useEffect } from "react";
import { MdSend } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import Router from "../../routes";
import cx from "classnames";
// import { WizzardContext } from "../../context/WizzardContext";

const Messenger = ({
  isClose = false,
  windowMessenger = false,
  conversation = {
    id: 1212,
    type: "group",
    name: "Grupowa konwersacja",
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
        message: "Lorem",
        data: new Date(),
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
}) => {
  const messageArea = useRef(null);
  const messageForm = useRef(null);
  const [messageContent, setMessageContent] = useState("");
  const [userInfo, setUserInfo] = useState({ id: 123 });
  useEffect(() => {
    messageArea.current.addEventListener("keydown", function textAreaSubmit(e) {
      if (e.keyCode == 13) {
        messageForm.current.dispatchEvent(new Event("submit"));
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submits");
  };

  return (
    <div
      className={cx("messenger", {
        "is-close": isClose,
        "window-messanger": windowMessenger === true,
      })}
    >
      <div className="messenger__navbar">
        <div className="messenger__navbar__person">
          <div className="messenger__navbar__person__photo">
            <img
              src={"/static/images/" + conversation.photo}
              alt=""
              className="messenger__navbar__person__photo--img"
            />
          </div>
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
              onClick={() => setStatusOfMessage(false)}
            >
              <AiOutlineClose />
            </div>
          </div>
        ) : null}
      </div>
      <div className="messenger__text">
        {conversation.messages.map((item, index) => {
          const addAuthor =
            index + 1 === conversation.messages.length ||
            conversation.messages[index + 1].idUser !== item.idUser;
          const user = users[item.idUser];

          return item.idUser === userInfo.id ? (
            <div className="messenger__text--myself" key={index}>
              <span className="messenger__text--myself--primary-color messganer-text-style">
                {item.message}
              </span>
            </div>
          ) : (
            <div className="messenger__text--stranger" key={index}>
              <span className="messenger__text--stranger--primary-background-color messganer-text-style">
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
          <textarea
            ref={messageArea}
            type="text"
            className="messenger__downbar__form--textarea"
            placeholder="Napisz wiadomość"
            onChange={(e) => setMessageContent(e.target.value)}
          />
          <button className="messenger__downbar__form--buton">
            <MdSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Messenger;

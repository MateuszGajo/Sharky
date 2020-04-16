import React, { useRef, useEffect, useState, useContext } from "react";
import { MdSend } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import cx from "classnames";
import { WizzardContext } from "../../context/WizzardContext";

const Message = () => {
  const messageArea = useRef(null);
  const messageForm = useRef(null);
  const [messageContent, setMessageContent] = useState("");
  const [userInfo, setUserInfo] = useState({ id: 123 });

  const conversation = {
    idConversation: 1212,
    members: [123, 124],
    messages: [
      {
        idUser: 123,
        message: "Co tam?",
        data: new Date(),
      },
      {
        idUser: 123,
        message: "Mordo",
        data: new Date(),
      },
      {
        idUser: 124,
        message: "Leci",
        data: new Date(),
      },
      {
        idUser: 123,
        message: "to git",
        data: new Date(),
      },
    ],
  };

  const { isMessage, setStatusOfMessage } = useContext(WizzardContext);
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  useEffect(() => {
    messageArea.current.addEventListener("keydown", function textAreaSubmit(e) {
      if (e.keyCode == 13) {
        messageForm.current.dispatchEvent(new Event("submit"));
      }
    });
  }, []);
  return (
    <div className={cx("home-wrapper__message", { "is-close": !isMessage })}>
      <div className="home-wrapper__message__navbar">
        <div className="home-wrapper__message__navbar__person">
          <div className="home-wrapper__message__navbar__person__picture">
            <FaUserCircle />
          </div>
          <div className="home-wrapper__message__navbar__person--name">
            <span className="home-wrapper__message__navbar__person--name--text">
              Kamil
            </span>
          </div>
        </div>

        <div className="home-wrapper__message__navbar__icons">
          <div
            className="home-wrapper__message__navbar__icons--icon"
            onClick={() => setStatusOfMessage(false)}
          >
            <AiOutlineClose />
          </div>
        </div>
      </div>
      <div className="home-wrapper__message__text">
        {conversation.messages.map((item, index) =>
          item.idUser === userInfo.id ? (
            <div className="home-wrapper__message__text--myself" key={index}>
              <span className="home-wrapper__message__text--myself--primary-color messganer-text-style">
                {item.message}
              </span>
            </div>
          ) : (
            <div className="home-wrapper__message__text--stranger" key={index}>
              <span className="home-wrapper__message__text--stranger--primary-background-color messganer-text-style">
                {item.message}
              </span>
            </div>
          )
        )}
      </div>
      <div className="home-wrapper__message__downbar">
        <form onSubmit={handleSubmit} ref={messageForm}>
          <textarea
            ref={messageArea}
            type="text"
            className="home-wrapper__message__downbar--textarea"
            placeholder="Napisz wiadomość"
            onChange={(e) => setMessageContent(e.target.value)}
          />
          <button className="home-wrapper__message__downbar--buton">
            <MdSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Message;

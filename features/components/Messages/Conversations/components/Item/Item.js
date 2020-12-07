import React, { useState, useEffect, useContext } from "react";
import cx from "classnames";
import AppContext from "~features/context/AppContext";

const Item = ({
  userId,
  chatId,
  messageTo,
  firstName,
  lastName,
  photo,
  message: intialMessage,
  setChat,
  chat,
  setStatusOfDisplayMobile,
}) => {
  const { newMessage, owner } = useContext(AppContext);

  const [message, setMessage] = useState(intialMessage);
  const [boldText, setBoldText] = useState(false);

  useEffect(() => {
    if (newMessage.chatId == chatId) {
      setMessage(newMessage.message);
      if (chat.chatId != chatId) setBoldText(true);
    }
  }, [newMessage]);
  return (
    <div
      className="conversations__item"
      key={chatId}
      onClick={() => {
        setChat({
          user: {
            id: userId,
            firstName,
            lastName,
            photo,
          },
          chatId,
        });
        setBoldText(false);
        setStatusOfDisplayMobile(true);
      }}
    >
      <div className="conversations__item__photo">
        <img
          src={"/static/images/" + photo}
          alt=""
          className="conversations__item__photo--img"
        />
      </div>

      <div className="conversations__item__content">
        <div className="conversations__item__content__name">
          <span className="conversations__item__content__name__span">
            {firstName + " " + lastName}
          </span>
        </div>
        <div className="conversations__item__content__last-message">
          <span
            className={cx("conversations__item__content__last-message__span", {
              "conversations__item__content__last-message__span--bold":
                owner.id == messageTo || boldText,
            })}
          >
            {message}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Item;

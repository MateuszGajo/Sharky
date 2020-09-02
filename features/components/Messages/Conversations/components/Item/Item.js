import React, { useState, useEffect, useContext } from "react";
import cx from "classnames";
import AppContext from "@features/context/AppContext";

const Item = ({
  idUser,
  idChat,
  messageTo,
  firstName,
  lastName,
  photo,
  message: intialMessage,
  setChat,
  chat,
}) => {
  const { newMessage, owner } = useContext(AppContext);

  const [message, setMessage] = useState(intialMessage);
  const [textBold, setTextBold] = useState(false);

  useEffect(() => {
    if (newMessage.idChat == idChat) {
      setMessage(newMessage.message);
      if (chat.idChat != idChat) setTextBold(true);
    }
  }, [newMessage]);
  return (
    <div
      className="conversations__item"
      key={idChat}
      onClick={() => {
        setChat({
          user: {
            id: idUser,
            firstName,
            lastName,
            photo,
          },
          idChat,
        });
        setTextBold(false);
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
        <div className="conversations__item__content--name">
          <span className="conversations__item__content--name--span">
            {firstName + " " + lastName}
          </span>
        </div>
        <div className="conversations__item__content--last-message">
          <span
            className={cx("conversations__item__content__last-message--span", {
              "conversations__item__content__last-message--span--bold":
                owner.id == messageTo || textBold,
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

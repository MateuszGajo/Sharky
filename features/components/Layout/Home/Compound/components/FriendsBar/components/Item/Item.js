import React, { useEffect, useState, useContext } from "react";
import { BsEnvelope } from "react-icons/bs";
import axios from "axios";
import { WizzardContext } from "../../../../context/WizzardContext";
import AppContext from "../../../../../../../../context/AppContext";

const Item = ({ user }) => {
  const { newMessage, owner, socket } = useContext(AppContext);
  const { setStatusOfMessenger, setChat, chat } = useContext(WizzardContext);
  const [isNewMessage, setStatusOfNewMessage] = useState(
    owner.id === user?.messageTo
  );

  useEffect(() => {
    const { idChat } = newMessage;
    if (idChat == user.idChat && chat.idChat != user.idChat) {
      setStatusOfNewMessage(true);
    }
  }, [newMessage]);

  return (
    <div
      className="home_friends__list__item"
      key={user.id}
      //   data-testid={`friend${index}`}
      onClick={() => {
        setChat({
          user: {
            id: user.idUser,
            firstName: user.firstName,
            lastName: user.lastName,
            photo: user.photo,
          },
          idChat: user.idChat,
        });
        setStatusOfMessenger(false);
        setStatusOfNewMessage(false);
        if (user.messageTo)
          axios.post("/friend/message/read", { idChat: user.idChat });
      }}
    >
      <div className="home_friends__list__item__user">
        <div className="home_friends__list__item__user__photo">
          <img
            src={"/static/images/" + user.photo}
            alt=""
            className="home_friends__list__item__user__photo--img"
          />
          {isNewMessage && (
            <div className="home_friends__list__item__user__photo__message">
              <BsEnvelope />
            </div>
          )}
        </div>
        <div className="home_friends__list__item__user--name">
          <span className="home_friends__list__item__user--name--span">
            {user.firstName} {user.lastName}
          </span>
        </div>
      </div>
      {/* {friend.online ? (
                  <div className="home_friends__list__item--online">
                    <div className="home_friends__list__item--online--circle"></div>
                  </div>
                ) : null} */}
    </div>
  );
};

export default Item;

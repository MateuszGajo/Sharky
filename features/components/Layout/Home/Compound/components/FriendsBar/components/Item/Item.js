import React, { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import { BsEnvelope } from "react-icons/bs";
import axios from "~features/service/Axios";
import { WizzardContext } from "../../../../context/WizzardContext";
import AppContext from "~features/context/AppContext";

const Item = ({ user }) => {
  const { firstName, lastName, userId, photo, chatId } = user;

  const { newMessage, owner, socket } = useContext(AppContext);
  const { setStatusOfMessenger, setChat, chat } = useContext(WizzardContext);

  const [isNewMessage, setStatusOfNewMessage] = useState(
    owner.id === user?.messageTo
  );

  useEffect(() => {
    const { chatId: messageChatId, userId: messageUserId } = newMessage;
    if (
      messageChatId === user.chatId &&
      chat.chatId !== user.chatId &&
      messageUserId === owner.id
    ) {
      setStatusOfNewMessage(true);
      socket.emit("isMessageUnRead", { userId });
    }
  }, [newMessage]);

  return (
    <div
      className="home_friends__list__item"
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
        setStatusOfMessenger(false);
        setStatusOfNewMessage(false);
        if (user.messageTo) axios.post("/friend/message/read", { userId });
      }}
      aria-hidden="true"
    >
      <div className="home_friends__list__item__user">
        <div className="home_friends__list__item__user__photo">
          <img
            src={`/static/images/${photo}`}
            alt=""
            className="home_friends__list__item__user__photo__photo"
          />
          {isNewMessage && (
            <div className="home_friends__list__item__user__photo__message">
              <BsEnvelope />
            </div>
          )}
        </div>
        <div className="home_friends__list__item__user__name">
          <span className="home_friends__list__item__user__name__span">
            {`${firstName} ${lastName}`}
          </span>
        </div>
      </div>
    </div>
  );
};

Item.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    photo: PropTypes.string.isRequired,
    chatId: PropTypes.number.isRequired,
    messageTo: PropTypes.number,
  }).isRequired,
};

export default Item;

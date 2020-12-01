import React from "react";
import PropTypes from "prop-types";
import Item from "./components/Item/Item";

const Conversations = ({ items, setChat, chat, setStatusOfDisplayMobile }) => {
  return (
    <div className="conversations">
      {items.map((conversation) => {
        return (
          <Item
            key={conversation.chatId}
            {...conversation}
            setChat={setChat}
            chat={chat}
            setStatusOfDisplayMobile={setStatusOfDisplayMobile}
          />
        );
      })}
    </div>
  );
};

Conversations.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.number,
      chatId: PropTypes.number,
      messageTo: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      photo: PropTypes.string,
      message: PropTypes.string,
    })
  ),
  setChat: PropTypes.func,
  chat: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      photo: PropTypes.string,
    }),
    chatId: PropTypes.number,
  }),
  setStatusOfDisplayMobile: PropTypes.func,
};

export default Conversations;

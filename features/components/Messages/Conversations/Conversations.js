import React from "react";
import PropTypes from "prop-types";
import Item from "./components/Item/Item";

const Conversations = ({ items, setChat, chat, setStatusOfDisplayMobile }) => (
  <div className="conversations">
    {items.map((conversation) => (
      <Item
        key={conversation.chatId}
        {...conversation}
        setChat={setChat}
        chat={chat}
        setStatusOfDisplayMobile={setStatusOfDisplayMobile}
      />
    ))}
  </div>
);

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
  ).isRequired,
  setChat: PropTypes.func.isRequired,
  chat: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      photo: PropTypes.string,
    }),
    chatId: PropTypes.number,
  }).isRequired,
  setStatusOfDisplayMobile: PropTypes.func.isRequired,
};

export default Conversations;

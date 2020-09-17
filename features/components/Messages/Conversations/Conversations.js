import React from "react";
import Item from "./components/Item/Item";

const conversations = ({ items, setChat, chat, setStatusOfDisplayMobile }) => {
  return (
    <div className="conversations">
      {items.map((conversation) => {
        return (
          <Item
            key={conversation.idChat}
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

export default conversations;

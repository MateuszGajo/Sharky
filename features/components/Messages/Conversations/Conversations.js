import React from "react";
import Item from "./components/Item/Item";

const conversations = ({ items, setChat, chat }) => {
  return (
    <div className="conversations">
      {items.map((conversation) => {
        return <Item {...conversation} setChat={setChat} chat={chat} />;
      })}
    </div>
  );
};

export default conversations;

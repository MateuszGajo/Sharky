import React from "react";
import { MdGroup } from "react-icons/md";
import { IconContext } from "react-icons";

const conversations = ({ items, setItem }) => {
  return (
    <div className="conversations">
      {items.map((conversation) => {
        return (
          <div
            className="conversations__item"
            key={conversation.id}
            onClick={() => setItem(conversation)}
          >
            {conversation.photo === "group" ? (
              <div className="conversations__item__icon">
                <IconContext.Provider
                  value={{
                    className: "conversations__item__icon--group",
                  }}
                >
                  <MdGroup />
                </IconContext.Provider>
              </div>
            ) : (
              <div className="conversations__item__photo">
                <img
                  src={"/static/images/" + conversation.photo}
                  alt=""
                  className="conversations__item__photo--img"
                />
              </div>
            )}

            <div className="conversations__item__content">
              <div className="conversations__item__content--name">
                <span className="conversations__item__content--name--span">
                  {conversation.name}
                </span>
              </div>
              <div className="conversations__item__content--last-message">
                <span className="conversations__item__content--last-message--span">
                  {
                    conversation.messages[conversation.messages.length - 1]
                      .message
                  }
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default conversations;

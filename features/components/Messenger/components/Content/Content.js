import React, { useRef, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import AppContext from "@features/context/AppContext";

const Content = ({ messages, user }) => {
  const { firstName, lastName, photo } = user;
  const { owner } = useContext(AppContext);

  const contentRef = useRef(null);

  useEffect(() => {
    const { current: content } = contentRef;
    content.scrollTop = content.scrollHeight;
  }, []);

  return (
    <div
      className="messenger__text"
      ref={contentRef}
      data-testid="messenger-chat"
    >
      {messages.map((message, index) => {
        const addAuthor =
          index + 1 === messages.length ||
          messages[index + 1].userId !== message.userId;

        return message.userId == owner.id ? (
          <div className="messenger__text__myself" key={index}>
            <span className="messenger__text__myself--primary-color messenger-text-style">
              {message.message}
            </span>
          </div>
        ) : (
          <div className="messenger__text__stranger" key={index}>
            <span className="messenger__text__stranger--primary-background-color messenger-text-style">
              {message.message}
            </span>
            {addAuthor ? (
              <div className="messenger__text__stranger__user">
                <div
                  className="messenger__text__stranger__user__container"
                  title={firstName + " " + lastName}
                  onClick={() => Route.pust(`/profile/${message.userId}`)}
                >
                  <div className="messenger__text__stranger__user__container__photo">
                    <img
                      src={"/static/images/" + photo}
                      alt=""
                      className="messenger__text__stranger__user__container__photo--img"
                    />
                  </div>
                  <div className="messenger__text__stranger__user__container__name">
                    <span className="messenger__text__stranger__user__container__name__span">
                      {firstName} {lastName}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

Content.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    chatId: PropTypes.number,
    userId: PropTypes.number,
    message: PropTypes.string,
    date: PropTypes.string
  }))
}

export default Content;

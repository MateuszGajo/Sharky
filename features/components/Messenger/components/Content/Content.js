import React, { useRef, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import Router from "next/router";
import AppContext from "~features/context/AppContext";

const Content = ({ messages, user, scrollDown }) => {
  const { firstName, lastName, photo } = user;
  const { owner } = useContext(AppContext);

  const contentRef = useRef(null);

  useEffect(() => {
    const { current: content } = contentRef;
    content.scrollTop = content.scrollHeight;
  }, []);

  useEffect(() => {
    const { current: content } = contentRef;
    content.scrollTop = content.scrollHeight;
  }, [scrollDown]);

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

        return message.userId === owner.id ? (
          <div className="messenger__text__myself" key={message.id}>
            <span className="messenger__text__myself--primary-color messenger-text-style">
              {message.message}
            </span>
          </div>
        ) : (
          <div className="messenger__text__stranger" key={message.id}>
            <span className="messenger__text__stranger--primary-background-color messenger-text-style">
              {message.message}
            </span>
            {addAuthor ? (
              <div className="messenger__text__stranger__user">
                <div
                  className="messenger__text__stranger__user__container"
                  title={`${firstName} ${lastName}`}
                  onClick={() => Router.pust(`/profile/${message.userId}`)}
                  aria-hidden="true"
                >
                  <div className="messenger__text__stranger__user__container__photo">
                    <img
                      src={`/static/images/${photo}`}
                      alt=""
                      className="messenger__text__stranger__user__container__photo--img"
                    />
                  </div>
                  <div className="messenger__text__stranger__user__container__name">
                    <span className="messenger__text__stranger__user__container__name__span">
                      {`${firstName} ${lastName}`}
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
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      chatId: PropTypes.number,
      userId: PropTypes.number,
      message: PropTypes.string,
      date: PropTypes.string,
    })
  ).isRequired,
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
  }).isRequired,
  scrollDown: PropTypes.number.isRequired,
};

export default Content;

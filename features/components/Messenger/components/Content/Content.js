import React, { useRef, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import Router from "next/router";
import AppContext from "~features/context/AppContext";

const Content = ({ messages, user, scrollDown, fetchMessages, isMore }) => {
  const { firstName, lastName, photo } = user;
  const { owner } = useContext(AppContext);

  const scrollRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const { current: content } = contentRef;
    const { current: scroll } = scrollRef;
    scroll.scrollTop = content.scrollHeight;
  }, [scrollDown]);

  return (
    <div
      className="messenger__text"
      data-testid="messenger-chat"
      id="messenger__text"
      ref={scrollRef}
    >
      <InfiniteScroll
        dataLength={messages.length}
        next={() => fetchMessages(messages.length)}
        inverse
        hasMore={isMore}
        scrollableTarget="messenger__text"
      >
        <div className="messenger__text__container" ref={contentRef}>
          {messages.map((message, index) => {
            const addAuthor =
              index === 0 || messages[index - 1].userId !== message.userId;

            return message.userId === owner.id ? (
              <div
                className="messenger__text__container__myself"
                key={message.id}
              >
                <span className="messenger__text__container__myself--primary-color messenger-text-style">
                  {message.message}
                </span>
              </div>
            ) : (
              <div
                className="messenger__text__container__stranger"
                key={message.id}
              >
                <span className="messenger__text__container__stranger--primary-background-color messenger-text-style">
                  {message.message}
                </span>
                {addAuthor ? (
                  <div className="messenger__text__container__stranger__user">
                    <div
                      className="messenger__text__container__stranger__user__container"
                      title={`${firstName} ${lastName}`}
                      onClick={() => Router.pust(`/profile/${message.userId}`)}
                      aria-hidden="true"
                    >
                      <div className="messenger__text__container__stranger__user__container__photo">
                        <img
                          src={`/static/images/${photo}`}
                          alt=""
                          className="messenger__text__container__stranger__user__container__photo--img"
                        />
                      </div>
                      <div className="messenger__text__container__stranger__user__container__name">
                        <span className="messenger__text__container__stranger__user__container__name__span">
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
      </InfiniteScroll>
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
  fetchMessages: PropTypes.func.isRequired,
  isMore: PropTypes.bool.isRequired,
};

export default Content;

import React, { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import { IoIosHeartEmpty } from "react-icons/io";
import { FiMessageCircle } from "react-icons/fi";
import cx from "classnames";
import Router from "next/router";
import {
  likeComment,
  unlikeComment,
  likeReply,
  unlikeReply,
} from "../../services/Functions";
import WizzardContext from "../../context/WizzardContext";
import AppContext from "~features/context/AppContext";
import Menu from "./components/Menu/Menu";

const Comment = ({
  comment,
  setStatusOfOpenReplies,
  numberOfReplies,
  isRepliesOpen,
  focusCollapse,
  focusIcon,
  getReplies,
  user,
  replies,
  setReplies,
  setNumberOfReplies,
}) => {
  const { id, firstName, lastName, photo } = user;

  const { setError } = useContext(AppContext);
  const { newLike, setNewLike } = useContext(WizzardContext);

  const [likeId, setIdLike] = useState(comment?.likeId);
  const [numberOfLikes, setNumberOfLikes] = useState(
    Number(comment.numberOfLikes)
  );

  const setlikeComment = () => {
    if (likeId) {
      "numberOfReplies" in comment
        ? unlikeComment({
            likeId,
            commentId: comment.commentId,
            setNewLike,
            setError,
          })
        : unlikeReply({
            replyId: comment.replyId,
            setNewLike,
            setError,
          });
    } else {
      "numberOfReplies" in comment
        ? likeComment({ commentId: comment.commentId, setNewLike, setError })
        : likeReply({ replyId: comment.replyId, setNewLike, setError });
    }
  };

  useEffect(() => {
    if (
      newLike.type === "comment" &&
      newLike.idElement === comment.commentId &&
      numberOfReplies !== null
    ) {
      setIdLike(newLike.likeId);
      newLike.likeId
        ? setNumberOfLikes(numberOfLikes + 1)
        : setNumberOfLikes(numberOfLikes - 1);
    } else if (
      newLike.type === "reply" &&
      newLike.idElement === comment.replyId &&
      numberOfReplies === null
    ) {
      setIdLike(newLike.likeId);
      newLike.likeId
        ? setNumberOfLikes(numberOfLikes + 1)
        : setNumberOfLikes(numberOfLikes - 1);
    }
  }, [newLike]);

  return (
    <div className="post__item__comments__container__item">
      <div
        className="post__item__comments__container__item__photo"
        onClick={() => {
          Router.push(`/profile/${id}`);
        }}
        aria-hidden="true"
      >
        <img
          src={`/static/images/${photo}`}
          alt=""
          className="post__item__comments__container__item__photo--img"
        />
      </div>
      <div className="post__item__comments__container__item__content">
        <div className="post__item__comments__container__item__content__item">
          <div className="post__item__comments__container__item__content__item__top-bar">
            <div
              className="post__item__comments__container__item__content__item__top-bar__user-name"
              onClick={() => {
                Router.push(`/profile/${id}`);
              }}
              aria-hidden="true"
            >
              <span className="post__item__comments__container__item__content__item__top-bar__user-name__span">
                {`${firstName} ${lastName}`}
              </span>
            </div>
            <Menu
              focusCollapse={focusCollapse}
              focusIcon={focusIcon}
              id={id}
              comment={comment}
              replies={replies}
              setReplies={setReplies}
              setNumberOfReplies={setNumberOfReplies}
            />
          </div>
          <div className="post__item__comments__container__item__content__item__text">
            {comment.content}
          </div>
          <div className="post__item__comments__container__item__content__item__down-bar">
            <div
              className={cx(
                "post__item__comments__container__item__content__item__down-bar__icon hover-pal-color",
                {
                  "pal-color": likeId,
                }
              )}
              onClick={() => {
                setlikeComment();
              }}
              aria-hidden="true"
            >
              <IoIosHeartEmpty />
              <span className="post__item__comments__container__item__content__item__down-bar__icon__number">
                {numberOfLikes}
              </span>
            </div>
            {numberOfReplies !== null && (
              <div
                className="post__item__comments__container__item__content__item__down-bar__icon hover-primary-color"
                onClick={() => {
                  if (!isRepliesOpen) {
                    getReplies();
                  }
                  setStatusOfOpenReplies(!isRepliesOpen);
                }}
                aria-hidden="true"
              >
                <FiMessageCircle />
                <span className="post__item__comments__container__item__content__item__down-bar__icon__number">
                  {numberOfReplies}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Comment.defaultProps = {
  replies: [
    {
      replyId: null,
      userId: null,
      numberOFLikes: null,
      likedId: null,
      date: "",
      content: "",
    },
  ],
  focusCollapse: {
    current: null,
  },
  focusIcon: {
    current: null,
  },
};
const element = typeof Element === "undefined" ? () => {} : Element;

Comment.defaultProps = {
  setNumberOfReplies: () => {},
  setReplies: () => {},
  isRepliesOpen: false,
  getReplies: () => {},
  setStatusOfOpenReplies: () => {},
  numberOfReplies: null,
};

Comment.propTypes = {
  comment: PropTypes.shape({
    replyId: PropTypes.number,
    commentId: PropTypes.number,
    content: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    likeId: PropTypes.number,
    numberOfLikes: PropTypes.number.isRequired,
    numberOfReplies: PropTypes.number,
    postId: PropTypes.number,
    userId: PropTypes.number.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
  }).isRequired,
  replies: PropTypes.arrayOf(
    PropTypes.shape({
      replyId: PropTypes.number.isRequired,
      userId: PropTypes.number.isRequired,
      numberOfLikes: PropTypes.number,
      likedId: PropTypes.number,
      date: PropTypes.string.isRequired,
      content: PropTypes.string,
    })
  ),
  setReplies: PropTypes.func,
  setNumberOfReplies: PropTypes.func,
  setStatusOfOpenReplies: PropTypes.func,
  numberOfReplies: PropTypes.number,
  isRepliesOpen: PropTypes.bool,
  getReplies: PropTypes.func,
  focusCollapse: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(element) }),
  ]),
  focusIcon: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(element) }),
  ]),
};

export default Comment;

import React, { useContext } from "react";
import PropTypes from "prop-types";
import { IconContext } from "react-icons";
import { AiOutlineDelete } from "react-icons/ai";
import {
  deleteComment,
  deleteReply,
} from "../../../../../../services/Functions";
import PostContext from "../../../../../../context/PostContext";
import AppContext from "~features/context/AppContext";

const OwnerMenu = ({
  deleteCommentText,
  comment,
  replies,
  setReplies,
  setNumberOfReplies,
}) => {
  const { comments, setComments, setNumberOfComments } = useContext(
    PostContext
  );
  const { setError } = useContext(AppContext);

  return (
    <div
      className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item"
      onClick={() => {
        "numberOfReplies" in comment
          ? deleteComment({
              commentId: comment.commentId,
              comments,
              setComments,
              setError,
              setNumberOfComments,
            })
          : deleteReply({
              replyId: comment.replyId,
              replies,
              setReplies,
              setError,
              setNumberOfReplies,
            });
      }}
      aria-hidden="true"
    >
      <div className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item__icon">
        <IconContext.Provider
          value={{
            className:
              "post__item__comments__container__item__content__item__top-bar__icon__collapse__item__icon__customize",
          }}
        >
          <AiOutlineDelete />
        </IconContext.Provider>
      </div>
      <div className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item__name">
        <span className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item__name__span">
          {deleteCommentText}
        </span>
      </div>
    </div>
  );
};

OwnerMenu.defaultProps = {
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
};

OwnerMenu.propTypes = {
  deleteCommentText: PropTypes.func.isRequired,
  comment: PropTypes.shape({
    replyId: PropTypes.number,
    commentId: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    likeId: PropTypes.number,
    numberOfLikes: PropTypes.number.isRequired,
    numberOfReplies: PropTypes.number.isRequired,
    postId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
  }).isRequired,
  replies: PropTypes.shape({
    replyId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    numberOFLikes: PropTypes.number.isRequired,
    likedId: PropTypes.number,
    date: PropTypes.string.isRequired,
    content: PropTypes.string,
  }),
  setReplies: PropTypes.func.isRequired,
  setNumberOfReplies: PropTypes.func.isRequired,
};

export default OwnerMenu;

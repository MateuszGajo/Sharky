import React, { useContext, useEffect } from "react";
import { IconContext } from "react-icons";
import { AiOutlineDelete } from "react-icons/ai";
import {
  deleteComment,
  deleteReply,
} from "../../../../../../services/Functions";
import PostContext from "../../../../../../context/PostContext";
import AppContext from "@features/context/AppContext";

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

export default OwnerMenu;

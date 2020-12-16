import React, { useContext } from "react";
import PropTypes from "prop-types";
import { IconContext } from "react-icons";
import { FiFlag } from "react-icons/fi";
import AppContext from "~features/context/AppContext";

const OwnerMenu = ({ reportCommentText, comment }) => {
  const { setReport } = useContext(AppContext);
  return (
    <>
      <div
        className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item"
        onClick={() => setReport({ type: "comment", id: comment.commentId })}
        aria-hidden="true"
      >
        <div className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item__icon">
          <IconContext.Provider
            value={{
              className:
                "post__item__comments__container__item__content__item__top-bar__icon__collapse__item__icon__customize",
            }}
          >
            <FiFlag />
          </IconContext.Provider>
        </div>
        <div className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item__name">
          <span className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item__name__span">
            {reportCommentText}
          </span>
        </div>
      </div>
    </>
  );
};

OwnerMenu.propTypes = {
  reportCommentText: PropTypes.string.isRequired,
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
};

export default OwnerMenu;

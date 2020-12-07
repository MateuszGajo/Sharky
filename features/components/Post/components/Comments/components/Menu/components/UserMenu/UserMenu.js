import React, { useContext } from "react";
import { IconContext } from "react-icons";
import { FiFlag } from "react-icons/fi";
import AppContext from "~features/context/AppContext";

const OwnerMenu = ({ reportCommentText, id, comment }) => {
  const { setReport } = useContext(AppContext);
  return (
    <>
      <div
        className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item"
        onClick={() => setReport({ type: "comment", id: comment.commentId })}
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

export default OwnerMenu;

import React from "react";
import { FiMessageCircle } from "react-icons/fi";
import { AiOutlineShareAlt } from "react-icons/ai";
import { IoIosHeartEmpty } from "react-icons/io";
import cx from "classnames";
import Router from "../../../../route/routes";

const DownBarButtons = ({
  statisticks = { comments: 123, likes: 123, shares: 23 },
  isLiked = false,
  postId,
}) => {
  return (
    <div className="post__item__downbar__buttons">
      <div
        className="post__item__downbar__buttons__icon  hover-primary-color"
        onClick={() => {
          Router.pushRoute("post", { id: postId });
        }}
      >
        <FiMessageCircle />
        <p
          data-testid="downbar-number-of-comments"
          className="post__item__downbar__buttons__icon--number"
        >
          {statisticks.comments}
        </p>
      </div>
      <div
        data-testid="downbar-heart-icon"
        className={cx("post__item__downbar__buttons__icon  hover-pal-color", {
          "pal-color": isLiked,
        })}
        onClick={(e) => {
          e.stopPropagation();
          if (!isLiked) {
            //save db
          }
        }}
      >
        <IoIosHeartEmpty />
        <p
          data-testid="downbar-number-of-likes"
          className="post__item__downbar__buttons__icon--number"
        >
          {statisticks.likes}
        </p>
      </div>
      <div
        className="post__item__downbar__buttons__icon  hover-family-color"
        onClick={(e) => e.stopPropagation()}
      >
        <AiOutlineShareAlt />
        <p
          data-testid="downbar-number-of-shares"
          className="post__item__downbar__buttons__icon--number"
        >
          {statisticks.shares}
        </p>
      </div>
    </div>
  );
};

export default DownBarButtons;

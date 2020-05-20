import React from "react";
import { FiMessageCircle } from "react-icons/fi";
import { AiOutlineShareAlt } from "react-icons/ai";
import { IoIosHeartEmpty } from "react-icons/io";
import cx from "classnames";
import Router from "../../routes";

const DownBarButtons = ({
  statisticks = { comments: 123, posts: 123, shares: 23 },
  isLiked = false,
  postId,
}) => {
  return (
    <div className="downbar-buttons">
      <div
        className="downbar-buttons__icon  hover-primary-color"
        onClick={() => {
          Router.pushRoute("post", { id: postId });
        }}
      >
        <FiMessageCircle />
        <p
          data-testid="downbar-buttons-number-of-comments"
          className="downbar-buttons__icon--number"
        >
          {statisticks.comments}
        </p>
      </div>
      <div
        data-testid="downbar-buttons-heart-icon"
        className={cx("downbar-buttons__icon  hover-pal-color", {
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
          data-testid="downbar-buttons-number-of-posts"
          className="downbar-buttons__icon--number"
        >
          {statisticks.posts}
        </p>
      </div>
      <div
        className="downbar-buttons__icon  hover-family-color"
        onClick={(e) => e.stopPropagation()}
      >
        <AiOutlineShareAlt />
        <p
          data-testid="downbar-buttons-number-of-shares"
          className="downbar-buttons__icon--number"
        >
          {statisticks.shares}
        </p>
      </div>
    </div>
  );
};

export default DownBarButtons;

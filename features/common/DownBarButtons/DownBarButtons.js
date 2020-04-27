import React from "react";
import { FiMessageCircle } from "react-icons/fi";
import { AiOutlineShareAlt } from "react-icons/ai";
import { IoIosHeartEmpty } from "react-icons/io";
import cx from "classnames";

const DownBarButtons = ({
  amounts = { comments: 123, post: 123, share: 23 },
  isLiked = false,
}) => {
  return (
    <div className="downbar-buttons">
      <div className="downbar-buttons__icon  hover-primary-color">
        <FiMessageCircle />
        <p className="downbar-buttons__icon--amount">{amounts.comments}</p>
      </div>
      <div
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
        <p className="downbar-buttons__icon--amount">{amounts.post}</p>
      </div>
      <div
        className="downbar-buttons__icon  hover-family-color"
        onClick={(e) => e.stopPropagation()}
      >
        <AiOutlineShareAlt />
        <p className="downbar-buttons__icon--amount">{amounts.share}</p>
      </div>
    </div>
  );
};

export default DownBarButtons;

import React, { useState } from "react";
import { FiMessageCircle } from "react-icons/fi";
import { AiOutlineShareAlt } from "react-icons/ai";
import { IoIosHeartEmpty } from "react-icons/io";
import cx from "classnames";
import axios from "axios";
import Router from "../../../../route/routes";

const DownBarButtons = ({
  statisticks = { comments: 123, likes: 123, shares: 23 },
  idLike: iL = false,
  idPost,
}) => {
  const [idLike, setIdLike] = useState(iL);
  return (
    <div className="post__item__downbar__buttons">
      <div
        className="post__item__downbar__buttons__icon  hover-primary-color"
        onClick={() => {
          Router.pushRoute("post", { id: idPost });
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
          "pal-color": idLike,
        })}
        onClick={(e) => {
          e.stopPropagation();
          if (!idLike) {
            axios
              .post("/post/like", { idPost })
              .then(({ data: { idPostLike } }) => setIdLike(idPostLike))
              .catch((err) => console.log(err));
          } else {
            axios
              .post("/post/unlike", { idLike })
              .then((resp) => setIdLike(null))
              .catch((err) => console.log(err));
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

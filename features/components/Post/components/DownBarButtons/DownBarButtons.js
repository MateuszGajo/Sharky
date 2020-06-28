import React, { useState } from "react";
import { FiMessageCircle } from "react-icons/fi";
import { AiOutlineShareAlt } from "react-icons/ai";
import { IoIosHeartEmpty } from "react-icons/io";
import cx from "classnames";
import axios from "axios";
import { postShare } from "../../services/Functions/index";
import Router from "../../../../route/routes";

const DownBarButtons = ({
  numberOfLikes: nof,
  numberOfComments,
  numberOfShares: nos,
  post,
  posts,
  setPosts,
}) => {
  const [idLike, setIdLike] = useState(post?.idLike);
  const [numberOfLikes, setNumberOfLikes] = useState(Number(nof));
  const [numberOfShares, setNumberOfShares] = useState(Number(nos));
  return (
    <div className="post__item__downbar__buttons">
      <div
        className="post__item__downbar__buttons__icon  hover-primary-color"
        onClick={() => {
          Router.pushRoute("post", { id: post.idPost });
        }}
      >
        <FiMessageCircle />
        <p
          data-testid="downbar-number-of-comments"
          className="post__item__downbar__buttons__icon--number"
        >
          {numberOfComments}
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
            setNumberOfLikes(numberOfLikes + 1);
            axios
              .post("/post/like", { idPost: post.idPost })
              .then(({ data: { idPostLike } }) => setIdLike(idPostLike))
              .catch((err) => console.log(err));
          } else {
            setNumberOfLikes(numberOfLikes - 1);
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
          {numberOfLikes}
        </p>
      </div>
      <div
        className="post__item__downbar__buttons__icon  hover-family-color"
        onClick={(e) => {
          setNumberOfShares(numberOfShares + 1);
          postShare({ post, posts, setPosts });
        }}
      >
        <AiOutlineShareAlt />
        <p
          data-testid="downbar-number-of-shares"
          className="post__item__downbar__buttons__icon--number"
        >
          {numberOfShares}
        </p>
      </div>
    </div>
  );
};

export default DownBarButtons;

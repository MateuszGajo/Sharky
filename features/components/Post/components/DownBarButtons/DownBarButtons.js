import React, { useState, useEffect, useContext, useCallback } from "react";
import { FiMessageCircle } from "react-icons/fi";
import { AiOutlineShareAlt } from "react-icons/ai";
import { IoIosHeartEmpty } from "react-icons/io";
import cx from "classnames";
import {
  sharePost,
  likePost,
  unlikePost,
} from "../../services/functions/index";
import Router from "../../../../route/routes";
import PostContext from "../../context/PostContext";
import WizzardContext from "../../context/WizzardContext";
import AppContext from "../../../../context/AppContext";

const DownBarButtons = () => {
  const { setStatusOfError: setError } = useContext(AppContext);
  const { post, numberOfComments } = useContext(PostContext);
  const { posts, setPosts, newLike, setNewLike } = useContext(WizzardContext);

  const [idLike, setIdLike] = useState(post?.idLike);
  const [numberOfLikes, setNumberOfLikes] = useState(
    Number(post.numberOfLikes)
  );
  const [numberOfShares, setNumberOfShares] = useState(
    Number(post.numberOfShares)
  );

  useEffect(() => {
    if (
      newLike.type.toLowerCase() == "post" &&
      newLike.idElement == post.idPost
    ) {
      setIdLike(newLike.idLike);

      newLike.idLike
        ? setNumberOfLikes(numberOfLikes + 1)
        : setNumberOfLikes(numberOfLikes - 1);
    }
  }, [newLike]);

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
        onClick={() => {
          idLike
            ? unlikePost({ idPost: post.idPost, setNewLike, idLike, setError })
            : likePost({ idPost: post.idPost, setNewLike, setError });
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
        onClick={() => {
          setNumberOfShares(numberOfShares + 1);
          sharePost({ post, posts, setPosts, setError });
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

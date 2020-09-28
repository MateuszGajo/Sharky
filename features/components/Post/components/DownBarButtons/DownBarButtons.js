import React, { useState, useEffect, useContext } from "react";
import { FiMessageCircle } from "react-icons/fi";
import { AiOutlineShareAlt } from "react-icons/ai";
import { IoIosHeartEmpty } from "react-icons/io";
import cx from "classnames";
import { sharePost, likePost, unlikePost } from "../../services/Functions";
import Router from "next/router";
import PostContext from "../../context/PostContext";
import WizzardContext from "../../context/WizzardContext";
import AppContext from "@features/context/AppContext";

const DownBarButtons = () => {
  const { setError } = useContext(AppContext);
  const { post, numberOfComments, isSingle, comments } = useContext(
    PostContext
  );
  const { posts, setPosts, newLike, setNewLike, setNewComment } = useContext(
    WizzardContext
  );

  const [likeId, setIdLike] = useState(post?.likeId);
  const [numberOfLikes, setNumberOfLikes] = useState(
    Number(post.numberOfLikes)
  );
  const [numberOfShares, setNumberOfShares] = useState(
    Number(post.numberOfShares)
  );

  useEffect(() => {
    if (
      newLike.type.toLowerCase() == "post" &&
      newLike.idElement == post.postId
    ) {
      setIdLike(newLike.likeId);

      newLike.likeId
        ? setNumberOfLikes(numberOfLikes + 1)
        : setNumberOfLikes(numberOfLikes - 1);
    }
  }, [newLike]);

  return (
    <div className="post__item__downbar__buttons">
      <div
        className="post__item__downbar__buttons__icon  hover-primary-color"
        onClick={() => {
          Router.pushRoute("post", { id: post.postId });
        }}
      >
        <FiMessageCircle />
        <p
          data-testid="downbar-number-of-comments"
          className="post__item__downbar__buttons__icon__number"
        >
          {numberOfComments}
        </p>
      </div>
      <div
        data-testid="downbar-heart-icon"
        className={cx("post__item__downbar__buttons__icon  hover-pal-color", {
          "pal-color": likeId,
        })}
        onClick={() => {
          likeId
            ? unlikePost({ postId: post.postId, setNewLike, likeId, setError })
            : likePost({ postId: post.postId, setNewLike, setError });
        }}
      >
        <IoIosHeartEmpty />
        <p
          data-testid="downbar-number-of-likes"
          className="post__item__downbar__buttons__icon__number"
        >
          {numberOfLikes}
        </p>
      </div>
      <div
        className="post__item__downbar__buttons__icon  hover-family-color"
        onClick={() => {
          setNumberOfShares(numberOfShares + 1);
          sharePost({
            post,
            posts,
            comments,
            setNewComment,
            numberOfComments,
            numberOfLikes,
            numberOfShares,
            setPosts,
            setError,
            isSingle,
          });
        }}
      >
        <AiOutlineShareAlt />
        <p
          data-testid="downbar-number-of-shares"
          className="post__item__downbar__buttons__icon__number"
        >
          {numberOfShares}
        </p>
      </div>
    </div>
  );
};

export default DownBarButtons;

import React, { useRef, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import DownBarButtons from "./components/DownBarButtons/DownBarButtons";
import Navbar from "./components/Navbar/Navbar";
import Content from "./components/Content/Content";
import Comment from "./components/Comments/CommentsContainer";
import SecondaryInput from "~common/SecondaryInput/SecondaryInput";
import withPost from "./withPost";
import PostContext from "./context/PostContext";
import WizzardContext from "./context/WizzardContext";
import AppContext from "~features/context/AppContext";
import i18next from "~i18n";
import { addComent, getComments } from "./services/Functions";
const { useTranslation } = i18next;

const Post = ({ post, focusElement, forward }) => {
  const { t } = useTranslation(["component"]);
  const loadMoreComments = t("component:post.comments.load-more-comments");
  const loadComments = t("component:post.comments.load-comments");

  const { setError, owner } = useContext(AppContext);

  const { newComment, setNewComment, muteUser, users, setUsers } = useContext(
    WizzardContext
  );

  const focusIcon = useRef(null);

  const [commentText, setCommentText] = useState("");

  const {
    isHidenPost,
    isMoreComments,
    comments,
    setComments,
    numberOfComments,
    setNumberOfComments,
    setStatusOfMoreComments,
  } = useContext(PostContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    addComent({
      postId: post.postId,
      content: commentText,
      clearText: setCommentText,
      setNewComment,
      setError,
    });
  };

  useEffect(() => {
    if (newComment.type == "post" && newComment.idElement == post.postId) {
      setComments([
        {
          commentId: newComment.commentId,
          userId: owner.id,
          likeId: null,
          numberOfLikes: 0,
          numberOfReplies: 0,
          content: newComment.content,
          date: newComment.date,
        },
        ...(comments ? comments : []),
      ]);
      setNumberOfComments(numberOfComments + 1);
    }
  }, [newComment]);

  useEffect(() => {
    if (muteUser.userId != null) {
      const newComments = comments?.filter(
        (comment) => comment.userId != muteUser.userId
      );
      setComments(newComments);
    }
  }, [muteUser]);

  return (
    <div
      className={cx("post__item", {
        "is-close": isHidenPost,
      })}
    >
      <Navbar focusCollapse={focusElement} focusIcon={focusIcon} />
      <Content forward={forward} />
      <div className="post__item__downbar">
        <DownBarButtons />
      </div>
      <div className="post__item__comments">
        <div className="post__item__comments__input">
          <form onSubmit={handleSubmit}>
            <SecondaryInput
              size={"medium"}
              value={commentText}
              onChange={setCommentText}
              photo={owner.photo}
            />
          </form>
        </div>
        {comments?.map((comment) => (
          <div
            className="post__item__comments__container"
            key={comment.commentId}
            data-test="comments"
          >
            <Comment
              comment={comment}
              focusCollapse={focusElement}
              focusIcon={focusIcon}
            />
          </div>
        ))}
        {isMoreComments && (
          <p
            className="post__item__comments__more-content"
            onClick={() =>
              getComments({
                postId: post.postId,
                from: comments.length,
                users,
                setUsers,
                comments,
                setComments,
                setStatusOfMoreData: setStatusOfMoreComments,
              })
            }
          >
            {comments.length ? loadMoreComments : loadComments}
          </p>
        )}
      </div>
    </div>
  );
};
const element = typeof Element === "undefined" ? function () {} : Element;

Post.propTypes = {
  focusElement: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(element) }),
  ]),
};

export default withPost(Post);

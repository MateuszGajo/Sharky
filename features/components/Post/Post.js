import React, { useRef, useState, useEffect, useContext } from "react";
import cx from "classnames";
import DownBarButtons from "./components/DownBarButtons/DownBarButtons";
import Navbar from "./components/Navbar/Navbar";
import Content from "./components/Content/Content";
import Comment from "./components/Comments/CommentsContainer";
import SecondaryInput from "@common/SecondaryInput/SecondaryInput";
import Report from "@common/PopUp/Report/Report";
import withPost from "./withPost";
import PostContext from "./context/PostContext";
import WizzardContext from "./context/WizzardContext";
import AppContext from "@features/context/AppContext";
import i18next from "@i18n";
import { addComent, getComments } from "./services/Functions";
const { useTranslation } = i18next;

const Post = ({ post, focusElement }) => {
  const { t } = useTranslation(["component"]);
  const loadMoreComments = t("component:post.comments.load-more-comments");

  const { setError, owner } = useContext(AppContext);

  const { newComment, setNewComment, muteUser, users, setUsers } = useContext(
    WizzardContext
  );

  const focusIcon = useRef(null);

  const [commentText, setCommentText] = useState("");

  const {
    isHidenPost,
    isReport,
    isMoreComments,
    comments,
    setComments,
    numberOfComments,
    setNumberOfComments,
    setStatusOfMoreComments,
    setStatusOfReport,
  } = useContext(PostContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    addComent({
      idPost: post.idPost,
      content: commentText,
      date: new Date(),
      clearText: setCommentText,
      setNewComment,
      setError,
    });
  };

  useEffect(() => {
    if (newComment.type == "post" && newComment.idElement == post.idPost) {
      setComments([
        {
          id: newComment.idComment,
          idUser: owner.id,
          idLike: null,
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
    if (muteUser.idUser != null) {
      const newComments = comments?.filter(
        (comment) => comment.idUser != muteUser.idUser
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
      {isReport && (
        <Report
          type="post"
          id={post.idPost}
          setStatusOfReport={setStatusOfReport}
        />
      )}
      <Navbar focusCollapse={focusElement} focusIcon={focusIcon} />
      <Content />
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
            />
          </form>
        </div>
        {comments?.map((comment) => (
          <div
            className="post__item__comments__container"
            key={comment.id}
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
                idPost: post.idPost,
                from: comments.length,
                users,
                setUsers,
                comments,
                setComments,
                setStatusOfMoreData: setStatusOfMoreComments,
              })
            }
          >
            {loadMoreComments}
          </p>
        )}
      </div>
    </div>
  );
};

export default withPost(Post);

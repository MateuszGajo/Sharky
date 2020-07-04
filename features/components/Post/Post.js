import React, { useRef, useState, useEffect, useContext } from "react";
import DownBarButtons from "./components/DownBarButtons/DownBarButtons";
import Navbar from "./components/Navbar/Navbar";
import Content from "./components/Content/Content";
import Comment from "./components/Comments/CommentsContainer";
import SecondaryInput from "../../common/SecondaryInput/SecondaryInput";
import Report from "../../common/PopUp/Report/Report";
import withPost from "./withPost";
import PostContext from "./context/PostContext";
import i18next from "../../../i18n";
import { addComent, getComments } from "./services/Functions/index";
const { useTranslation } = i18next;

const Post = ({ post: p, user, userShare, focusElement, single }) => {
  const { t } = useTranslation(["component"]);
  const loadMoreComments = t("component:post.comments.load-more-comments");

  const focusCollapse = useRef(focusElement?.current || null);
  const focusIcon = useRef(null);

  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addComent({
      idPost: p.idPost,
      content: commentText,
      date: new Date(),
      clearText: setCommentText,
      setNewComment,
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
        ...comments,
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
      <Navbar focusCollapse={focusCollapse} focusIcon={focusIcon} />
      <Content post={post} />
      <div className="post__item__downbar">
        <DownBarButtons />
      </div>
      {isComment && (
        <div className="post__item__comments" data-testid="post-comments">
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
            <div className="post__item__comments__container" key={comment.id}>
              <Comment
                comment={comment}
                focusCollapse={focusCollapse}
                focusIcon={focusIcon}
              />
            </div>
          ))}
          {isMoreComments && (
            <p
              className="post__item__comments__more-content"
              onClick={() =>
                getComments({
                  idPost: p.idPost,
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
      )}
    </div>
  );
};

export default withPost(Post);

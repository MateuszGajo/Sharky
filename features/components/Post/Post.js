import React, { useRef, useState, useEffect } from "react";
import DownBarButtons from "./components/DownBarButtons/DownBarButtons";
import Navbar from "./components/Navbar/Navbar";
import Content from "./components/Content/Content";
import Comment from "./components/Comments/CommentsContainer";
import SecondaryInput from "../../common/SecondaryInput/SecondaryInput";
import Report from "../../common/PopUp/Report/Report";
import i18next from "../../../i18n";
import { addComent, getComments } from "./services/Functions/index";
import { cx } from "emotion";
const { useTranslation } = i18next;
const Post = ({
  post: p = {
    id: 1,
    idUser: 1,
    idLike: 1,
    idUserShare: 1,
    idShare: null,
    numberOfShares: 2,
    numberOfComments: 5,
    numberOfLikes: 6,
    isMoreComments,
    content: "dasdsa",
    date: new Date("2019-03-25"),
    photo: "profile.png",
    comments: [
      {
        id: 1,
        idUser: 1,
        idLike: null,
        numberOfLikes: 20,
        numberOfReplies: 5,
        content: "ble",
        date: new Date(),
      },
      {
        id: 2,
        idUser: 1,
        idLike: null,
        numberOfLikes: 19,
        numberOfReplies: 4,
        content: "ble fds as",
        date: new Date(),
      },
    ],
  },
  users = {
    1: {
      id: 1,
      firstName: "Janek",
      lastName: "Kowalski",
      photo: "profile.png",
      idLiked: null,
    },
    2: {
      id: 2,
      firstName: "Janek",
      lastName: "Kowalski",
      photo: "profile.png",
      idLiked: null,
    },
  },
  posts,
  setPosts,
  setUsers,
  isComment = true,
  focusElement,
  newLike,
  setNewLike,
  newComment,
  setNewComment,
  owner,
}) => {
  const { t } = useTranslation(["component"]);
  const loadMoreComments = t("component:post.comments.load-more-comments");

  const focusCollapse = useRef(focusElement?.current || null);
  const focusIcon = useRef(null);

  const [user, setUser] = useState(users[p.idUser]);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(p.comments);
  const [post, setPost] = useState(p);
  const [isMoreComments, setStatusOfMoreComments] = useState(p.isMoreComments);
  const [numberOfComments, setNumberOfComments] = useState(
    Number(post.numberOfComments)
  );
  const [isHidenPost, setStatusOfHiddenPost] = useState(false);
  const [isReport, setStatusOfReport] = useState(false);

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
      <Navbar
        date={post.date}
        user={user}
        shareUser={users[p?.idUserShare]}
        idUser={p.idUserShare || p.idUser}
        posts={posts}
        setPosts={setPosts}
        focusCollapse={focusCollapse}
        focusIcon={focusIcon}
        setStatusOfHiddenPost={setStatusOfHiddenPost}
        setStatusOfReport={setStatusOfReport}
      />
      <Content post={post} />
      <div className="post__item__downbar">
        <DownBarButtons
          post={post}
          posts={posts}
          setPosts={setPosts}
          newLike={newLike}
          setNewLike={setNewLike}
          numberOfComments={numberOfComments}
          numberOfLikes={post.numberOfLikes}
          numberOfShares={post.numberOfShares}
        />
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
                users={users}
                owner={owner}
                setUsers={setUsers}
                newLike={newLike}
                setNewLike={setNewLike}
                newComment={newComment}
                setNewComment={setNewComment}
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

export default Post;

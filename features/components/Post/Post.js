import React, { useRef, useState } from "react";
import axios from "axios";
import DownBarButtons from "./components/DownBarButtons/DownBarButtons";
import Navbar from "./components/Navbar/Navbar";
import Content from "./components/Content/Content";
import Comment from "./components/Comments/CommentsContainer";
import SecondaryInput from "../../common/SecondaryInput/SecondaryInput";
import i18next from "../../../i18n";
import { addComent, getComments } from "./services/Functions/index";
const { useTranslation } = i18next;
const Post = ({
  post: p = {
    id: 1,
    idUser: 1,
    idLike: 1,
    idUserShare: 1,
    content: "dasdsa",
    date: new Date("2019-03-25"),
    photo: "profile.png",
    likes: 20,
    shares: 20,
    comments: [
      {
        id: 1,
        idUser: 1,
        likes: 20,
        content: "ble",
        numberOfReplies: 1,
      },
      {
        id: 2,
        idUser: 1,
        likes: 20,
        content: "ble",
        numberOfReplies: 2,
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
  setUsers,
  isMoreComments: statusOfMoreComments = true,
  isComment = true,
  focusElement,
}) => {
  const { t } = useTranslation(["component"]);

  const loadMoreComments = t("component:post.comments.load-more-comments");

  const focusCollapse = useRef(focusElement?.current || null);
  const focusIcon = useRef(null);

  const [user, setUser] = useState(users[p.idUser]);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(p.comments);
  const [post, setPost] = useState(p);
  const [isMoreComments, setStatusOfMoreComments] = useState(
    statusOfMoreComments
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    addComent({
      comments,
      setComments,
      idPost: p.id,
      content: newComment,
      date: new Date(),
      clearText: setNewComment,
    });
  };

  return (
    <div className="post__item">
      <Navbar
        date={post.date}
        user={user}
        idUserShare={post.idUserShare}
        focusCollapse={focusCollapse}
        focusIcon={focusIcon}
      />
      <Content post={post} />
      <div className="post__item__downbar">
        <DownBarButtons
          idPost={post.id}
          idLike={post.idLike}
          statisticks={{
            comments: post.comments?.length || 0,
            likes: post.likes,
            shares: post.shares,
          }}
        />
      </div>
      {isComment && (
        <div className="post__item__comments" data-testid="post-comments">
          <div className="post__item__comments__input">
            <form onSubmit={handleSubmit}>
              <SecondaryInput
                size={"medium"}
                value={newComment}
                onChange={setNewComment}
              />
            </form>
          </div>
          {comments.map((comment, index) => (
            <div className="post__item__comments__container" key={index}>
              <Comment
                comment={comment}
                focusCollapse={focusCollapse}
                focusIcon={focusIcon}
                users={users}
                setUsers={setUsers}
              />
            </div>
          ))}
          {isMoreComments && (
            <p
              className="post__item__comments__more-content"
              onClick={() =>
                getComments({
                  idPost: p.id,
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

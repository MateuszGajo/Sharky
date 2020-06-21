import React, { useRef, useState } from "react";
import axios from "axios";
import DownBarButtons from "./components/DownBarButtons/DownBarButtons";
import Navbar from "./components/Navbar/Navbar";
import Content from "./components/Content/Content";
import Comment from "./components/Comments/CommentsContainer";
import SecondaryInput from "../../common/SecondaryInput/SecondaryInput";
const Post = ({
  post: p = {
    id: 1,
    userId: 123,
    content: "dasdsa",
    date: new Date("2019-03-25"),
    photo: "profile.png",
    idLike: 1,
    likes: 20,
    shares: 20,
    comments: [
      {
        id: 1,
        idUser: 123,
        likes: 20,
        content: "ble",
        replies: [
          { id: 1, idUser: 123, likes: 20, content: "sdasa" },
          { id: 2, idUser: 123, likes: 30, content: "dasdss" },
        ],
      },
      {
        id: 2,
        idUser: 123,
        likes: 20,
        content: "ble",
        replies: [
          { id: 1, likes: 20, content: "sdasa" },
          { id: 2, likes: 30, content: "dasdss" },
        ],
      },
    ],
  },
  user = {
    id: 123,
    firstName: "Janek",
    lastName: "Kowalski",
    photo: "profile.png",
    idLiked: null,
  },
  isComment = true,
  isShare = true,
  focusElement,
}) => {
  const focusCollapse = useRef(focusElement?.current || null);
  const focusIcon = useRef(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(p.comments);
  const [post, setPost] = useState(p);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("/comment/add", {
        idPost: post.id,
        content: newComment,
      })
      .then(({ data: { user, idPost: id } }) => {
        setComments([
          {
            id,
            idUser: user.id,
            likes: 0,
            content: newComment,
            replies: [],
          },
          ...comments,
        ]);

        setNewComment("");
      })
      .catch((err) => console.log("err"));
  };

  return (
    <div className="post__item">
      <Navbar
        date={post.date}
        user={user}
        isShare={isShare}
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
                user={user}
                focusCollapse={focusCollapse}
                focusIcon={focusIcon}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const areEqual = (prevProps, nextProps) => {
  return null;
};

export default Post;

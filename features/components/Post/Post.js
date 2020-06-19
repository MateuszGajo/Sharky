import React, { useRef } from "react";
import DownBarButtons from "./components/DownBarButtons/DownBarButtons";
import Navbar from "./components/Navbar/Navbar";
import Content from "./components/Content/Content";
import Comment from "./components/Comments/CommentsContainer";
import SecondaryInput from "../../common/SecondaryInput/SecondaryInput";
const Post = ({
  post = {
    id: 1,
    userId: 123,
    content: "dasdsa",
    date: new Date("2019-03-25"),
    photo: "profile.png",
    idLiked: 1,
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
  focusElement,
}) => {
  const focusCollapse = useRef(focusElement?.current || null);
  const focusIcon = useRef(null);
  return (
    <div className="post__item">
      <Navbar
        date={post.date}
        user={user}
        focusCollapse={focusCollapse}
        focusIcon={focusIcon}
      />
      <Content post={post} />
      <div className="post__item__downbar">
        <DownBarButtons
          postId={post.id}
          isLiked={post.idLiked}
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
            <SecondaryInput size={"medium"} />
          </div>

          {post.comments.map((comment) => (
            <div className="post__item__comments__container">
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

export default Post;

import React from "react";
import Router from "../../../../route/routes";

const Content = ({ post }) => {
  return (
    <>
      <div
        className="post__item__content"
        onClick={() => {
          Router.pushRoute("post", { id: post.idPost });
        }}
      >
        <span className="post__item__content--span" data-testid="post-content">
          {post.content}
        </span>
      </div>
      {post?.photo && (
        <div
          className="post__item__photo"
          data-testid="post-photo"
          onClick={() => {
            Router.pushRoute("post", { id: post.idPost });
          }}
        >
          <img
            src={"/static/images/" + post.photo}
            alt=""
            className="post__item__photo--img"
          />
        </div>
      )}
    </>
  );
};

export default Content;

import React, { useEffect } from "react";
import Router from "next/router";
import { IoMdClose, IoMdArrowForward } from "react-icons/io";
const PostPhoto = ({ src, postId, setSrc, forward = true }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <div className="post-photo">
      <div className="post-photo__close">
        <div
          className="post-photo__close__icon post-photo__circle-icon"
          onClick={() => {
            setSrc("");
          }}
        >
          <IoMdClose />
        </div>
      </div>
      {forward && (
        <div className="post-photo__forward">
          <div
            className="post-photo__forward__icon post-photo__circle-icon"
            onClick={() => {
              Router.push(`/post/${postId}`);
            }}
          >
            <IoMdArrowForward />
          </div>
        </div>
      )}
      <div className="post-photo__container no-scroll">
        <img
          className="post-photo__container__img"
          src={`/static/images/${src}`}
          alt="post's photo"
        />
      </div>
    </div>
  );
};

export default PostPhoto;

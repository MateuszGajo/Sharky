import React, { useEffect } from "react";
import Router from "next/router";
import { IoMdClose, IoMdArrowForward } from "react-icons/io";
const PostPhoto = ({ src, postId, setSrc, forward = true }) => {
  useEffect(() => {
    document.body.classList.add("invisible-scroll");
    return () => {
      document.body.classList.remove("invisible-scroll");
    };
  }, []);
  return (
    <div
      className="post-photo"
      onClick={() => {
        setSrc("");
      }}
    >
      <div className="post-photo__close">
        <div
          className="post-photo__close__icon post-photo__circle-icon"
          onClick={(e) => {
            e.stopPropagation();
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
            onClick={(e) => {
              e.stopPropagation();
              Router.push(`/post/${postId}`);
            }}
          >
            <IoMdArrowForward />
          </div>
        </div>
      )}
      <div
        className="post-photo__container no-scroll"
        onClick={(e) => e.stopPropagation()}
      >
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

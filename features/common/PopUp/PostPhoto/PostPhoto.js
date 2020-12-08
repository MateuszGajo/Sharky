import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Router from "next/router";
import { IoMdClose, IoMdArrowForward } from "react-icons/io";

const PostPhoto = ({ src, postId, setSrc, forward }) => {
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
      aria-hidden="true"
    >
      <div className="post-photo__close">
        <div
          className="post-photo__close__icon post-photo__circle-icon"
          onClick={(e) => {
            e.stopPropagation();
            setSrc("");
          }}
          aria-hidden="true"
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
            aria-hidden="true"
          >
            <IoMdArrowForward />
          </div>
        </div>
      )}
      <div
        className="post-photo__container no-scroll"
        onClick={(e) => e.stopPropagation()}
        aria-hidden="true"
      >
        <img
          className="post-photo__container__img"
          src={`/static/images/${src}`}
          alt="post"
        />
      </div>
    </div>
  );
};

PostPhoto.defaultProps = {
  forward: true,
};

PostPhoto.propTypes = {
  src: PropTypes.string.isRequired,
  postId: PropTypes.number.isRequired,
  setSrc: PropTypes.func.isRequired,
  forward: PropTypes.bool,
};

export default PostPhoto;

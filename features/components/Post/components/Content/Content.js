import React, { useState, useRef, useEffect } from "react";
import Router from "../../../../route/routes";
import { editPost } from "../../services/Functions/index";
import PrimaryButton from "../../../../common/PrimaryButton/PrimaryButton";

const Content = ({ post, isEdit }) => {
  const textareaRef = useRef(null);
  const [rows, setRows] = useState(1);
  const [content, setContent] = useState(post.content);

  const handleChange = (e) => {
    const rows = textareaRef.current.value.split("\n").length + 1;
    setRows(rows);
    setContent(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editPost({ idPost: post.idPost, content });
  };

  useEffect(() => {
    if (isEdit) {
      const rows = textareaRef.current.value.split("\n").length + 1;
      setRows(rows);
    }
  }, [isEdit]);
  return (
    <>
      <div
        className="post__item__content"
        onClick={() => {
          !isEdit && Router.pushRoute("post", { id: post.idPost });
        }}
      >
        {isEdit ? (
          <form className="post__item__content__form" onSubmit={handleSubmit}>
            <textarea
              className="post__item__content__form--textarea"
              ref={textareaRef}
              rows={rows}
              value={content}
              onChange={(e) => handleChange(e)}
              autoFocus
            ></textarea>
            <button>zapisz</button>
          </form>
        ) : (
          <pre className="post__item__content--pre" data-testid="post-content">
            {post.content}
          </pre>
        )}
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

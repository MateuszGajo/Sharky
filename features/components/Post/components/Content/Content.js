import React, { useState, useRef, useEffect, useContext } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import Router from "next/router";
import { editPost } from "../../services/Functions";
import PostContext from "../../context/PostContext";
import WizzardContext from "../../context/WizzardContext";
import AppContext from "@features/context/AppContext";

const Content = () => {
  const textareaRef = useRef(null);

  const { setError } = useContext(AppContext);
  const { post, isEdit, setStatusOfEdit } = useContext(PostContext);
  const { newContent, setNewContent } = useContext(WizzardContext);

  const [rows, setRows] = useState(1);
  const [content, setContent] = useState(post.content);

  const handleChange = (e) => {
    const rows = textareaRef.current.value.split("\n").length + 1;
    setRows(rows);
    setContent(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editPost({
      postId: post.postId,
      content,
      setNewContent,
      setStatusOfEdit,
      setError,
    });
  };

  useEffect(() => {
    if (isEdit) {
      const rows = textareaRef.current.value.split("\n").length + 1;
      setRows(rows);
    }
  }, [isEdit]);

  useEffect(() => {
    if (newContent.postId == post.postId) {
      setContent(newContent.text);
    }
  }, [newContent]);
  return (
    <>
      <div
        className="post__item__content"
        onClick={() => {
          !isEdit && Router.push(`/post/${post.postId}`);
        }}
      >
        {isEdit ? (
          <form className="post__item__content__form" onSubmit={handleSubmit}>
            <button className="post__item__content__form__button">
              <AiOutlineCheck />
            </button>
            <textarea
              className="post__item__content__form__textarea"
              ref={textareaRef}
              rows={rows}
              value={content}
              onChange={(e) => handleChange(e)}
              autoFocus
            ></textarea>
          </form>
        ) : (
          <pre className="post__item__content__pre" data-testid="post-content">
            {content}
          </pre>
        )}
      </div>
      {post?.photo && (
        <div
          className="post__item__photo"
          data-testid="post-photo"
          onClick={() => {
            Router.push(`/post/${post.postId}`);
          }}
        >
          <img
            src={"/static/images/" + post.photo}
            alt=""
            className="post__item__photo__img"
          />
        </div>
      )}
    </>
  );
};

export default Content;

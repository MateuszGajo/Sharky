import React, { useState, useContext } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import cx from "classnames";
import "./main.scss";
import { WizzardContext } from "../../context/WizzardContext";
const Main = ({ children, search, addingPost, onSubmit }) => {
  const handlePostSubmit = (e) => {
    e.preventDefault();
    setPost(postContent);
    onSubmit({
      postContent,
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchContent);
    onSubmit({
      searchContent,
    });
  };

  const { setPostContent: setPost, setSearchContent: setSearch } = useContext(
    WizzardContext
  );

  const [postContent, setPostContent] = useState("");
  const [searchContent, setSearchContent] = useState("");
  return (
    <div className="home-wrapper__main">
      <div
        data-testid="main-search"
        className={cx("home-wrapper__main__search", { "is-close": !search })}
      >
        <form
          className="home-wrapper__main__search__form"
          onSubmit={handleSearchSubmit}
        >
          <input
            type="text"
            className="home-wrapper__main__search__form--input"
            data-testid="search-input"
            onChange={(e) => setSearchContent(e.target.value)}
          />
          <button
            type="submit"
            className="home-wrapper__main__search__form--icon"
            data-testid="search-button"
          >
            <AiOutlineSearch />
          </button>
        </form>
      </div>
      <div
        data-testid="main-add-post"
        className={cx("home-wrapper__main__content__message", {
          "is-close": !addingPost,
        })}
      >
        <div className="home-wrapper__main__content__message__navbar">
          Dodaj post
        </div>
        <div className="home-wrapper__main__content__message--text">
          <form onSubmit={handlePostSubmit}>
            <textarea
              placeholder="Co u Ciebie?"
              className="home-wrapper__main__content__message--text--textarea"
              data-testid="post-text-area"
              required
              onChange={(e) => setPostContent(e.target.value)}
            />
            <button className="home-wrapper__main__content__message--text--button">
              Opublikuj
            </button>
          </form>
        </div>
      </div>
      <div className="home-wrapper__main__content">{children}</div>
    </div>
  );
};

export default Main;

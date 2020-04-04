import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import cx from "classnames";
import "./main.scss";
const Main = ({ children, search, addingPost }) => {
  return (
    <div className="home-wrapper__main">
      <div
        className={cx("home-wrapper__main__search", { "is-close": !search })}
      >
        <input type="text" className="home-wrapper__main__search--input" />
        <AiOutlineSearch className="home-wrapper__main__search--icon" />
      </div>
      <div
        className={cx("home-wrapper__main__content__message", {
          "is-close": !addingPost,
        })}
      >
        <div className="home-wrapper__main__content__message__navbar">
          Dodaj post
        </div>
        <div className="home-wrapper__main__content__message--text">
          <textarea
            placeholder="Co u Ciebie?"
            className="home-wrapper__main__content__message--text--textarea"
            required
          />
          <button className="home-wrapper__main__content__message--text--button">
            Opublikuj
          </button>
        </div>
      </div>
      <div className="home-wrapper__main__content">{children}</div>
    </div>
  );
};

export default Main;

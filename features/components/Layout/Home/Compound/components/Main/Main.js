import React, { useState, useContext } from "react";
import cx from "classnames";
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
      <div className="home-wrapper__main__content">{children}</div>
    </div>
  );
};

export default Main;

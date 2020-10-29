import React from "react";
import PropTypes  from "prop-types";
import { AiOutlineSearch } from "react-icons/ai";
import cx from "classnames";

const Search = ({ value, onChange, size = "large" }) => {
  return (
    <div
      data-testid="search"
      className={cx("search", {
        "search--x-large": size === "x-large",
        "search--large": size === "large",
        "search--medium": size === "medium",
        "search--small": size === "small",
      })}
    >
      <input
        type="text"
        className="search__input"
        data-testid="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="submit"
        className="search__icon"
        data-testid="search-button"
      >
        <AiOutlineSearch />
      </button>
    </div>
  );
};

Search.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  size: PropTypes.string
}

export default Search;

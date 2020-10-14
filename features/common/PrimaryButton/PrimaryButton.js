import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

const PrimaryButton = ({
  value = "wyślij",
  size = "medium",
  border = false,
  isDisable = false,
  link = "",
}) => {
  return (
    <button
      data-testid="primary-button"
      className={cx("primary-button", {
        "primary-button--small": size === "small",
        "primary-button--medium": size === "medium",
        "primary-button--large": size === "large",
        "primary-button--x-large": size === "x-large",
        "primary-button--border": border,
        "is-close": isDisable === true,
      })}
    >
      {link ? (
        <a className="primary-button__link" href={link}>
          {value}
        </a>
      ) : (
        value
      )}
    </button>
  );
};

PrimaryButton.propTypes ={
  value: PropTypes.string,
  size: PropTypes.string,
  border: PropTypes.bool,
  isDisable: PropTypes.bool,
  link: PropTypes.string
}

export default PrimaryButton;

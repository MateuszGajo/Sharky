import React from "react";
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
        <a className="primary-button--link" href={link}>
          {value}
        </a>
      ) : (
        value
      )}
    </button>
  );
};

export default PrimaryButton;

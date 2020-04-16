import React from "react";
import cx from "classnames";

const PrimaryButton = ({
  value = "wyślij",
  size = "medium",
  border = false,
}) => {
  return (
    <button
      data-testid="primary-button"
      className={cx("primary-button", {
        "primary-button--small": size === "small",
        "primary-button--medium": size === "medium",
        "primary-button--large": size === "large",
        "primary-button--border": border,
      })}
    >
      {value}
    </button>
  );
};

export default PrimaryButton;

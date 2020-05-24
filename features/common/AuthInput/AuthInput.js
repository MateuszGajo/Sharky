import React from "react";
import cx from "classnames";

const InputAuth = ({
  value,
  onChange,
  type = "text",
  title,
  size = "large",
}) => {
  return (
    <div
      data-testid="auth-input-container"
      className={cx("auth-input-container", {
        "auth-input-container--x-large": size === "x-large",
        "auth-input-container--large": size === "large",
        "auth-input-container--medium": size === "medium",
        "auth-input-container--small": size === "small",
      })}
    >
      <input
        className="auth-input-container--input"
        type={type}
        data-testid="auth-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      <h2
        data-testid="auth-input-placeholder"
        className="auth-input-container--placeholder"
      >
        {title}
      </h2>
    </div>
  );
};

export default InputAuth;

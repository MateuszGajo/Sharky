import React, { useRef } from "react";
import cx from "classnames";

const InputAuth = ({
  value,
  onChange,
  type = "text",
  title,
  size = "large",
}) => {
  const input = useRef(null);
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
        ref={input}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      <h2
        data-testid="auth-input-placeholder"
        className="auth-input-container--placeholder"
        onClick={() => input.current.focus()}
      >
        {title}
      </h2>
    </div>
  );
};

export default InputAuth;

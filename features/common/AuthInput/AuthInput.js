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
      data-testid="auth-input"
      className={cx("auth-input", {
        "auth-input--x-large": size === "x-large",
        "auth-input--large": size === "large",
        "auth-input--medium": size === "medium",
        "auth-input--small": size === "small",
      })}
    >
      <input
        className="auth-input__input"
        type={type}
        data-testid="auth-input"
        value={value}
        ref={input}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      <h2
        data-testid="auth-input-placeholder"
        className="auth-input__placeholder"
      >
        {title}
      </h2>
    </div>
  );
};

export default InputAuth;

import React from "react";
import cx from "classnames";

const InputAuth = ({
  value,
  onChange,
  type = "text",
  title,
  withOutMargin = false,
}) => {
  return (
    <div
      data-testid="input-auth-container"
      className={cx("input-auth-container", {
        "reset-margin": withOutMargin === true,
      })}
    >
      <input
        className="input-auth-container--input"
        type={type}
        data-testid="input-auth"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      <h2
        data-testid="input-auth-placeholder"
        className="input-auth-container--placeholder"
      >
        {title}
      </h2>
    </div>
  );
};

export default InputAuth;

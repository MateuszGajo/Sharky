import React from "react";
import PropTypes from "prop-types";
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
      data-testid="container"
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
        data-testid="field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
        <h2
        data-testid="auth-input-placeholder"
        className="auth-input__placeholder"
        onClick={() => input.current.focus()}
      >
        {title}
      </h2>
    </div>
  );
};

InputAuth.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  title: PropTypes.string,
  size: PropTypes.string
}

export default InputAuth;

import React, { useRef } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

const InputAuth = ({ value, onChange, type, title, size }) => {
  const input = useRef(null);
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
        ref={input}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      <h2
        data-testid="auth-input-placeholder"
        className="auth-input__placeholder"
        onClick={() => input.current.focus()}
        aria-hidden="true"
      >
        {title}
      </h2>
    </div>
  );
};

InputAuth.defaultProps = {
  type: "text",
  size: "large",
};

InputAuth.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  title: PropTypes.string.isRequired,
  size: PropTypes.string,
};

export default InputAuth;

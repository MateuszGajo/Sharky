import React from "react";

const InputAuth = ({ value, onChange, type = "text", title }) => {
  return (
    <div className="input-form">
      <input
        className="input-form--text"
        type={type}
        data-testid="input-auth"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      <h2
        data-testid="input-auth-placeholder"
        className="input-form--placeholder"
      >
        {title}
      </h2>
    </div>
  );
};

export default InputAuth;

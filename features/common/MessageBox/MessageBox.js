import React from "react";
import cx from "classnames";
import PrimaryButton from "../PrimaryButton/PrimaryButton";

const MessageBox = ({
  value,
  onChange,
  size = "large",
  btnSize = "medium",
}) => {
  return (
    <div data-testid="message-box" className="message-box">
      <div className="message-box__navbar">Dodaj post</div>
      <div className="message-box__content">
        <textarea
          placeholder="Co u Ciebie?"
          className="message-box__content--textarea"
          data-testid="message-box-textarea"
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="message-box__content--button">
          <PrimaryButton value="Opublikuj" size="large" />
        </div>
      </div>
    </div>
  );
};

export default MessageBox;

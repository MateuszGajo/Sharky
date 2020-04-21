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
    <div
      data-testid="message-box"
      className={cx("message-box", {
        "message-box--x-large": size === "x-large",
        "message-box--large": size === "large",
        "message-box--medium": size === "medium",
        "message-box--small": size === "small",
      })}
    >
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
          <PrimaryButton value="Opublikuj" size={btnSize} />
        </div>
      </div>
    </div>
  );
};

export default MessageBox;

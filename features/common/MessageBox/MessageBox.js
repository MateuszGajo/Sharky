import React from "react";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import i18next from "../../../../i18n";
const { useTranslation } = i18next;

const MessageBox = ({ value, onChange, btnSize = "medium" }) => {
  const { t } = useTranslation();
  const title = t("common:message-box.title");
  const description = t("common:message-box.description");
  const buttonText = t("common:message-box.button");
  return (
    <div data-testid="message-box" className="message-box">
      <div className="message-box__navbar">{title}</div>
      <div className="message-box__content">
        <textarea
          placeholder={description}
          className="message-box__content--textarea"
          data-testid="message-box-textarea"
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="message-box__content--button">
          <PrimaryButton value={buttonText} size={btnSize} />
        </div>
      </div>
    </div>
  );
};

export default MessageBox;

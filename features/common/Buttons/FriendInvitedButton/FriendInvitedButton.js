import React from "react";
import { BsEnvelope } from "react-icons/bs";
import cx from "classnames";
import i18next from "~i18n";

const { useTranslation } = i18next;

const FriendInvitedButton = ({ size = "large", border = false }) => {
  const { t } = useTranslation();
  const sentText = t("component:lists.people.sent");

  return (
    <div
      className={cx("friend-invited-button", {
        "friend-invited-button--border": border,
        "friend-invited-button--border--small": border && size === "small",
        "friend-invited-button--border--medium": border && size === "medium",
        "friend-invited-button--border--large": border && size === "large",
      })}
    >
      <div
        className={cx("friend-invited-button__icon", {
          "friend-invited-button__icon--small": size === "small",
          "friend-invited-button__icon--medium": size === "medium",
          "friend-invited-button__icon--large": size === "large",
        })}
      >
        <BsEnvelope />
      </div>
      <div
        className={cx("friend-invited-button__text", {
          "friend-invited-button__text--small": size === "small",
          "friend-invited-button__text--medium": size === "medium",
          "friend-invited-button__text--large": size === "large",
        })}
      >
        {sentText}
      </div>
    </div>
  );
};

export default FriendInvitedButton;

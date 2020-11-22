import React from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import cx from "classnames";
import axios from "axios";
import i18next from "@i18n";

const { useTranslation } = i18next;

const AddFriendButton = ({
  icon = true,
  size = "large",
  border = false,
  userId,
  setButtonName,
}) => {
  const { t } = useTranslation();
  const addText = t("component:lists.people.add");

  const handleClick = () => {
    axios
      .post("/friend/add", { userId })
      .then(() => {
        setButtonName("invitation");
      })
      .catch(() => {});
  };
  return (
    <div
      className={cx("add-friend-button", {
        "add-friend-button--border": border,
      })}
      onClick={handleClick}
    >
      {icon && (
        <div
          className={cx("add-friend-button__icon", {
            "add-friend-button__icon--small": size === "small",
            "add-friend-button__icon--medium": size === "medium",
            "add-friend-button__icon--large": size === "large",
            "add-friend-button__icon--x-large": size === "x-large",
          })}
        >
          <AiOutlineUserAdd />
        </div>
      )}
      <div
        className={cx("add-friend-button__text", {
          "add-friend-button__text--small": size === "small",
          "add-friend-button__text--medium": size === "medium",
          "add-friend-button__text--large": size === "large",
          "add-friend-button__text--x-large": size === "x-large",
        })}
      >
        {addText}
      </div>
    </div>
  );
};

export default AddFriendButton;

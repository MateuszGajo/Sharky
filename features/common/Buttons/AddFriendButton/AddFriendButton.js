import React from "react";
import PropTypes from "prop-types";
import { AiOutlineUserAdd } from "react-icons/ai";
import cx from "classnames";
import axios from "~features/service/Axios";
import i18next from "~i18n";

const { useTranslation } = i18next;

const AddFriendButton = ({
  icon = true,
  size = "large",
  border = false,
  userId,
  setButtonName,
  invitePerson,
}) => {
  const { t } = useTranslation();
  const addText = t("component:lists.people.add");

  const handleClick = () => {
    if (invitePerson) {
      axios
        .post(`/${invitePerson.type}/user/invite`, {
          userId,
          targetId: invitePerson.targetId,
        })
        .then(() => setButtonName("invitation"))
        .catch(() => {});
    } else {
      axios
        .post("/friend/add", { userId })
        .then(() => {
          setButtonName("invitation");
        })
        .catch(() => {});
    }
  };
  return (
    <div
      className={cx("add-friend-button", {
        "add-friend-button--border": border,
      })}
      onClick={handleClick}
      aria-hidden="true"
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
        {invitePerson ? invitePerson.title : addText}
      </div>
    </div>
  );
};

AddFriendButton.defaultProps = {
  icon: true,
  size: "large",
  border: false,
};

AddFriendButton.propTypes = {
  icon: PropTypes.bool,
  size: PropTypes.string,
  border: PropTypes.bool,
  userId: PropTypes.number.isRequired,
  setButtonName: PropTypes.func.isRequired,
  invitePerson: PropTypes.shape({
    type: PropTypes.string.isRequired,
    targetId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default AddFriendButton;

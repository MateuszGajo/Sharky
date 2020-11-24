import React from "react";
import cx from "classnames";
import axios from "axios";
import i18next from "@i18n";

const { useTranslation } = i18next;

const FriendInvitationButtons = ({
  darkerBorder = true,
  size = "medium",
  userId,
  setButtonName,
  setCurrentRelation,
  setDeclineInvitation,
}) => {
  const { t } = useTranslation();
  const acceptText = t("component:lists.people.accept");
  const declineText = t("component:lists.people.decline");

  const handleAcceptButton = () => {
    axios.post("/friend/accept", { userId }).then(() => {
      setCurrentRelation("friend");
      setButtonName("relation");
    });
  };
  const handleDeclineButton = () => {
    axios.post("/friend/decline", { userId }).then(() => {
      if (setDeclineInvitation) setDeclineInvitation({ userId });
      else setButtonName("add");
    });
  };
  return (
    <div className="friend-invitation-buttons">
      <div
        className={cx(
          "friend-invitation-buttons__handle friend-invitation-buttons__accept",
          {
            "friend-invitation-buttons__handle--darker-border": darkerBorder,
            "friend-invitation-buttons__handle--small": size === "small",
            "friend-invitation-buttons__handle--medium": size === "medium",
            "friend-invitation-buttons__handle--large": size === "large",
          }
        )}
        onClick={handleAcceptButton}
      >
        {acceptText}
      </div>
      <div
        className={cx(
          "friend-invitation-buttons__handle friend-invitation-buttons__decline",
          {
            "friend-invitation-buttons__handle--darker-border": darkerBorder,
            "friend-invitation-buttons__handle--small": size === "small",
            "friend-invitation-buttons__handle--medium": size === "medium",
            "friend-invitation-buttons__handle--large": size === "large",
          }
        )}
        onClick={handleDeclineButton}
      >
        {declineText}
      </div>
    </div>
  );
};

export default FriendInvitationButtons;

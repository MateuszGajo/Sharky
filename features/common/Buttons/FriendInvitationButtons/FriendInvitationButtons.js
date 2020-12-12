import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import axios from "~features/service/Axios";
import i18next from "~i18n";

const { useTranslation } = i18next;

const FriendInvitationButtons = ({
  darkerBorder,
  size,
  userId,
  setButtonName,
  setCurrentRelation,
  setDeclineInvitation,
  setBlockCollapse,
}) => {
  const { t } = useTranslation();
  const acceptText = t("component:lists.people.accept");
  const declineText = t("component:lists.people.decline");

  const handleAcceptButton = () => {
    axios.post("/friend/accept", { userId }).then(() => {
      setBlockCollapse(false);
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
        aria-hidden="true"
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
        aria-hidden="true"
      >
        {declineText}
      </div>
    </div>
  );
};

FriendInvitationButtons.defaultProps = {
  darkerBorder: true,
  size: "medium",
  setDeclineInvitation: null,
  setBlockCollapse: () => {},
};

FriendInvitationButtons.propTypes = {
  darkerBorder: PropTypes.bool,
  size: PropTypes.string,
  userId: PropTypes.number.isRequired,
  setButtonName: PropTypes.func.isRequired,
  setCurrentRelation: PropTypes.func.isRequired,
  setDeclineInvitation: PropTypes.func,
  setBlockCollapse: PropTypes.func,
};

export default FriendInvitationButtons;

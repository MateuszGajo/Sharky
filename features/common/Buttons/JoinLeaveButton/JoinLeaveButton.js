import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

const JoinLeaveButton = ({
  id,
  subId,
  joinText,
  leaveText,
  size = "large",
  onClick,
  setNumber,
  setSubId,
}) => (
  <div className="join-leave-button">
    <div
      onClick={() => onClick({ subId, id, setNumber, setSubId })}
      className={cx("join-leave-button__button", {
        "join-leave-button__button--small": size === "small",
        "join-leave-button__button--medium": size === "medium",
        "join-leave-button__button--large": size === "large",
      })}
      aria-hidden="true"
    >
      {subId ? leaveText : joinText}
    </div>
  </div>
);

JoinLeaveButton.defaultProps = {
  size: "large",
  subId: null,
};

JoinLeaveButton.propTypes = {
  id: PropTypes.number.isRequired,
  subId: PropTypes.number,
  joinText: PropTypes.string.isRequired,
  leaveText: PropTypes.string.isRequired,
  size: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  setNumber: PropTypes.func.isRequired,
  setSubId: PropTypes.func.isRequired,
};

export default JoinLeaveButton;

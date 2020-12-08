import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

const JoinLeaveButton = ({
  id,
  refId,
  joinText,
  leaveText,
  size = "large",
  onClick,
  setNumber,
  setRefId,
}) => (
  <div className="join-leave-button">
    <div
      onClick={() => onClick({ refId, id, setNumber, setRefId })}
      className={cx("join-leave-button__button", {
        "join-leave-button__button--small": size === "small",
        "join-leave-button__button--medium": size === "medium",
        "join-leave-button__button--large": size === "large",
      })}
      aria-hidden="true"
    >
      {refId ? leaveText : joinText}
    </div>
  </div>
);

JoinLeaveButton.defaultProps = {
  size: "large",
};

JoinLeaveButton.propTypes = {
  id: PropTypes.number.isRequired,
  refId: PropTypes.number.isRequired,
  joinText: PropTypes.string.isRequired,
  leaveText: PropTypes.string.isRequired,
  size: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  setNumber: PropTypes.func.isRequired,
  setRefId: PropTypes.func.isRequired,
};

export default JoinLeaveButton;

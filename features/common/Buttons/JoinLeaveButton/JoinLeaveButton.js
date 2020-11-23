import React from "react";
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
}) => {
  return (
    <div className="join-leave-button">
      <div
        onClick={() => onClick({ refId, id, setNumber, setRefId })}
        className={cx("join-leave-button__button", {
          "join-leave-button__button--small": size === "small",
          "join-leave-button__button--medium": size === "medium",
          "join-leave-button__button--large": size === "large",
        })}
      >
        {refId ? leaveText : joinText}
      </div>
    </div>
  );
};

export default JoinLeaveButton;

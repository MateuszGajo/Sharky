import React from "react";
import cx from "classnames";

const JoinLeaveButton = ({
  subId = 1,
  joinText = "dołacz",
  leaveText = "opuść",
  size = "large",
  onClick,
}) => {
  return (
    <div className="join-leave-button">
      <div
        onClick={() => onClick({ subId })}
        className={cx("join-leave-button__button", {
          "join-leave-button__button--small": size === "small",
          "join-leave-button__button--medium": size === "medium",
          "join-leave-button__button--large": size === "large",
        })}
      >
        {subId ? leaveText : joinText}
      </div>
    </div>
  );
};

export default JoinLeaveButton;

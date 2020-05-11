import React from "react";
import cx from "classnames";

const SecondaryInput = ({
  user = { photo: "profile.png" },
  size = "medium",
  value,
  onChange,
}) => {
  return (
    <div className="secondary-input">
      <div className="secondary-input__photo">
        <img
          src={"/static/images/" + user.photo}
          alt="myself"
          className={cx("secondary-input__photo--img", {
            "secondary-input__photo--img--small": size === "small",
            "secondary-input__photo--img--medium": size === "medium",
            "secondary-input__photo--img--large": size === "large",
          })}
          data-testid="secondary-input-photo-img"
        />
      </div>
      <div className="secondary-input__text">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cx("secondary-input__text--input", {
            "secondary-input__text--input--small": size === "small",
            "secondary-input__text--input--medium": size === "medium",
            "secondary-input__text--input--large": size === "large",
          })}
          data-testid="secondary-input-field"
        />
      </div>
    </div>
  );
};

export default SecondaryInput;

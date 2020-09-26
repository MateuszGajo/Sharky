import React from "react";
import cx from "classnames";

const SecondaryInput = ({
  photo = "profile.png",
  size = "large",
  value,
  onChange,
}) => {
  return (
    <div className="secondary-input">
      <div className="secondary-input__photo">
        <img
          src={"/static/images/" + photo}
          alt="myself"
          className={cx("secondary-input__photo__photo", {
            "secondary-input__photo__photo--small": size === "small",
            "secondary-input__photo__photo--medium": size === "medium",
            "secondary-input__photo__photo--large": size === "large",
          })}
          data-testid="secondary-input-photo"
        />
      </div>
      <div className="secondary-input__text">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cx("secondary-input__text__input", {
            "secondary-input__text__input--small": size === "small",
            "secondary-input__text__input--medium": size === "medium",
            "secondary-input__text__input--large": size === "large",
          })}
          data-testid="secondary-input-field"
        />
      </div>
    </div>
  );
};

export default SecondaryInput;

import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

const SecondaryInput = ({
  photo = "profile.png",
  size = "large",
  value,
  onChange,
}) => (
  <div className="secondary-input">
    <div className="secondary-input__photo">
      <img
        src={`/static/images/${photo}`}
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

SecondaryInput.defaultProps = {
  photo: "profile.png",
  size: "large",
};

SecondaryInput.propTypes = {
  photo: PropTypes.string,
  size: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SecondaryInput;

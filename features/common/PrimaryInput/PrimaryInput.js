import React, { useState } from "react";
import cx from "classnames";

const PrimaryInput = ({
  type = "text",
  onChange,
  value,
  name,
  title,
  autocompleteData = [],
  withOutMargin = false,
  size = "large",
}) => {
  const [autocompleteDataFiltered, setAutocompleteDataFiltered] = useState([]);

  const handleChange = (e) => {
    onChange(e.target.value);
    if (e.target.value === "") setAutocompleteDataFiltered([]);
    else
      setAutocompleteDataFiltered(
        autocompleteData.filter((item) => {
          return item.toLowerCase().startsWith(e.target.value.toLowerCase());
        })
      );
  };
  return (
    <div
      data-testid="primary-input-container"
      className={cx("primary-input-container", {
        "reset-margin": withOutMargin === true,
        "primary-input-container--x-large": size === "x-large",
        "primary-input-container--large": size === "large",
        "primary-input-container--medium": size === "medium",
        "primary-input-container--small": size === "small",
      })}
    >
      <input
        type={type}
        name={name}
        className="primary-input-container--input"
        value={value}
        onChange={handleChange}
        data-testid="primary-input"
      />

      <h4
        className="primary-input-container--title"
        data-testid="primary-input-title"
      >
        {title}
      </h4>
      <div
        data-testid="input-primary-autocomplete"
        className={cx("primary-input-container__autocomplete", {
          "is-close": autocompleteDataFiltered.length === 0,
        })}
      >
        {autocompleteDataFiltered.map((item, index) => (
          <div
            className="primary-input-container__autocomplete--item"
            key={index}
            onClick={() => {
              onChange(item);
              setAutocompleteDataFiltered([]);
            }}
          >
            <span className="primary-input-container__autocomplete--item--span">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrimaryInput;

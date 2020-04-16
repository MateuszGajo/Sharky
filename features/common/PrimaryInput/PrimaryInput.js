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
          "is-close": autocompleteData.length === 0,
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

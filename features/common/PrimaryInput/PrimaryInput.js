import React, { useState, useRef, useEffect } from "react";
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

  const inputRef = useRef(null);

  const handleChange = (e) => {
    onChange(e.target.value);

    if (autocompleteData.length) {
      setAutocompleteDataFiltered(
        autocompleteData.filter((item) => {
          return item.value
            .toLowerCase()
            .startsWith(e.target.value.toLowerCase());
        })
      );
    }
  };

  const showList = () => {
    setAutocompleteDataFiltered(autocompleteData);
  };

  const hideList = () => {
    setAutocompleteDataFiltered([]);
  };

  useEffect(() => {
    if (autocompleteData.length) {
      inputRef.current.addEventListener("focus", showList);
      inputRef.current.addEventListener("focusout", hideList);
    }

    return () => {
      removeEventListener("focus", showList);
      removeEventListener("focusout", hideList);
    };
  }, []);
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
        ref={inputRef}
      />

      <h4
        className="primary-input-container--title"
        data-testid="primary-input-title"
      >
        {title}
      </h4>
      <div
        data-testid="input-primary-autocomplete"
        className={cx(
          "primary-input-container__autocomplete  primary-scroll-active",
          {
            "is-close": autocompleteDataFiltered.length === 0,
          }
        )}
      >
        {autocompleteDataFiltered.map(({ value }, index) => (
          <div
            className="primary-input-container__autocomplete--item"
            key={index}
            onClick={() => {
              onChange(value);
              setAutocompleteDataFiltered([]);
            }}
          >
            <span className="primary-input-container__autocomplete--item--span">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrimaryInput;

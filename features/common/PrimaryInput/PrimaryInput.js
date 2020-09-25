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
  require = false,
}) => {
  const [autocompleteDataFiltered, setAutocompleteDataFiltered] = useState([]);
  const [isFocus, setStatusOfFocus] = useState(false);

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
    setStatusOfFocus(true);
    window.addEventListener("click", hideList);
  };

  const hideList = (e) => {
    if (e.target.className != "primary-input-container__autocomplete__item") {
      setStatusOfFocus(false);
    }
    removeEventListener("click", hideList);
  };

  useEffect(() => {
    if (isFocus) {
      setAutocompleteDataFiltered(
        autocompleteData.filter((item) => {
          return item.value.toLowerCase().startsWith(value.toLowerCase());
        })
      );
    }
  }, [isFocus]);

  useEffect(() => {
    if (autocompleteData.length) {
      inputRef.current.addEventListener("focus", showList);
    }

    return () => {
      removeEventListener("focus", showList);
      removeEventListener("click", hideList);
    };
  }, [autocompleteData]);
  return (
    <div
      data-testid="primary-input"
      className={cx("primary-input", {
        "reset-margin": withOutMargin === true,
        "primary-input--x-large": size === "x-large",
        "primary-input--large": size === "large",
        "primary-input--medium": size === "medium",
        "primary-input--small": size === "small",
      })}
    >
      <input
        type={type}
        name={name}
        className="primary-input-container__input"
        value={value}
        onChange={handleChange}
        data-testid="primary-input"
        ref={inputRef}
        onClick={(e) => e.stopPropagation()}
        required={require}
      />

      <h4 className="primary-input__title" data-testid="primary-input-title">
        {title}
      </h4>
      <div
        data-testid="input-primary-autocomplete"
        className={cx(
          "primary-input-container__autocomplete  primary-scroll--active",
          {
            "is-close": !isFocus,
          }
        )}
      >
        {autocompleteDataFiltered.map((item, index) => (
          <div
            className="primary-input-container__autocomplete__item"
            key={index}
            onClick={() => {
              onChange(item.value);
              setAutocompleteDataFiltered([]);
              setStatusOfFocus(false);
            }}
          >
            <span className="primary-input-container__autocomplete__item__span">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrimaryInput;

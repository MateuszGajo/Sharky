import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
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
        autocompleteData.filter((item) =>
          item.value.toLowerCase().startsWith(e.target.value.toLowerCase())
        )
      );
    }
  };

  const hideList = (e) => {
    if (
      e.target.className !== "primary-input__autocomplete__item" &&
      document.activeElement.className !== "primary-input__input"
    ) {
      setStatusOfFocus(false);
      window.removeEventListener("click", hideList);
    }
  };

  const showList = () => {
    setStatusOfFocus(true);
    window.addEventListener("click", hideList);
  };

  useEffect(() => {
    if (isFocus) {
      setAutocompleteDataFiltered(
        autocompleteData.filter((item) =>
          item.value.toLowerCase().startsWith(value.toLowerCase())
        )
      );
    }
  }, [isFocus]);

  useEffect(() => {
    if (autocompleteData.length) {
      inputRef.current.addEventListener("focus", showList);
    }

    return () => {
      inputRef.current.removeEventListener("focus", showList);
      inputRef.current.removeEventListener("click", hideList);
    };
  }, [autocompleteData]);
  return (
    <div
      data-testid="container"
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
        className="primary-input__input"
        value={value}
        onChange={handleChange}
        data-testid="field"
        ref={inputRef}
        onClick={(e) => e.stopPropagation()}
        required={require}
      />

      <h4 className="primary-input__title" data-testid="title">
        {title}
      </h4>
      <div
        data-testid="autocomplete"
        className={cx("primary-input__autocomplete  primary-scroll--active", {
          "is-close": !isFocus,
        })}
      >
        {autocompleteDataFiltered.map((item) => (
          <div
            className="primary-input__autocomplete__item"
            key={item.value}
            onClick={() => {
              onChange(item.value);
              setAutocompleteDataFiltered([]);
              setStatusOfFocus(false);
            }}
            aria-hidden="true"
          >
            <span className="primary-input__autocomplete__item__span">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

PrimaryInput.defaultProps = {
  type: "text",
  autocompleteData: [],
  withOutMargin: false,
  size: "large",
  require: false,
};

PrimaryInput.propTypes = {
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  autocompleteData: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      name: PropTypes.string,
    })
  ),
  withOutMargin: PropTypes.bool,
  size: PropTypes.string,
  require: PropTypes.bool,
};

export default PrimaryInput;

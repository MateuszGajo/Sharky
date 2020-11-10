import React from "react";
import PropTypes from "prop-types";
import i18next from "@i18n";
const { useTranslation } = i18next;

const Checkbox = ({ value, onChange }) => {
  const { t } = useTranslation();
  const label = t("common:checkbox.label");
  return (
    <div className="checkbox">
      <div className="checkbox__icon">
        <input
          className="checkbox__icon__input"
          type="checkbox"
          value="None"
          id="remeberMe"
          name="check"
          data-testid="input-checkbox"
          onClick={() => onChange(!value)}
        />
        <label className="checkbox__icon__label" htmlFor="remeberMe"></label>
      </div>
      <span className="checkbox__text">{label}</span>
    </div>
  );
};

Checkbox.propTypes = {
  value: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Checkbox;

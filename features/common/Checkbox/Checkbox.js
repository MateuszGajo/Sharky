import React from "react";
import useTranslation from "next-translate/useTranslation";

const Checkbox = ({ value, onChange }) => {
  const { t } = useTranslation();
  const label = t("common:checkbox.label");
  return (
    <div className="checkbox">
      <div className="checkbox--icon">
        <input
          className="checkbox--icon--input"
          type="checkbox"
          value="None"
          id="remeberme"
          name="check"
          data-testid="input-checkbox"
          onClick={() => onChange(!value)}
        />
        <label className="checkbox--icon--label" htmlFor="remeberme"></label>
      </div>
      <span className="checkbox--text">{label}</span>
    </div>
  );
};

export default Checkbox;

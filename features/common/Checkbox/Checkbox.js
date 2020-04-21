import React from "react";

const Checkbox = ({ value, onChange }) => {
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
      <span className="checkbox--text">Zapamiętaj mnie</span>
    </div>
  );
};

export default Checkbox;

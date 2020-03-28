import React, { useContext } from "react";
import "./Credentials.scss";
import { WizzardContext } from "../../context/WizzardContext";
import cx from "classnames";
const Credentials = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword
  } = useContext(WizzardContext);
  return (
    <div className="authentication__form__wrapper__inputs__wrapper">
      <p className="input-error">Something go wrong</p>
      <div className={cx("input-form", { "reset-margin": "passwordError" })}>
        <input
          className="input-form--text"
          type="text"
          data-testid="email-input"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <h2 className="input-form--placeholder">Email</h2>
      </div>
      <p className="input-error">Something go wrong</p>
      <div
        className={cx("input-form", { "reset-margin": "confirmPasswordError" })}
      >
        <input
          className="input-form--text"
          type="text"
          data-testid="password-input"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <h2 className="input-form--placeholder">Hasło</h2>
      </div>
      <p className="input-error">Something go wrong</p>
      <div className="input-form">
        <input
          className="input-form--text"
          type="text"
          data-testid="confirmpassword-input"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        <h2 className="input-form--placeholder">Powtórz hasło</h2>
      </div>
    </div>
  );
};

export default Credentials;

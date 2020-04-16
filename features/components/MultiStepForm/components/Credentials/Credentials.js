import React, { useContext } from "react";
import cx from "classnames";
import { WizzardContext } from "../../context/WizzardContext";
import AuthInput from "../../../../common/InputAuth/InputAuth";

const Credentials = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
  } = useContext(WizzardContext);
  return (
    <div className="authentication__form__wrapper__inputs__wrapper">
      <p className="input-error">Something go wrong</p>
      <AuthInput value={email} onChange={setEmail} title="E-mail" />
      <p className="input-error">Something go wrong</p>
      <AuthInput
        type="password"
        value={password}
        onChange={setPassword}
        title="Hasło"
      />
      <p className="input-error">Something go wrong</p>
      <AuthInput
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        title="Powtórz hasło"
      />
    </div>
  );
};

export default Credentials;

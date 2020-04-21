import React, { useContext } from "react";
import cx from "classnames";
import { WizzardContext } from "../../context/WizzardContext";
import AuthInput from "../../../../common/AuthInput/AuthInput";

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
      <AuthInput
        value={email}
        onChange={setEmail}
        title="E-mail"
        withOutMargin={true}
        size="x-large"
        //withoutMargin should be true only on password Error
      />
      <p className="input-error">Something go wrong</p>
      <AuthInput
        type="password"
        value={password}
        onChange={setPassword}
        title="Hasło"
        withOutMargin={true}
        size="x-large"
        //withoutMargin should be true only on confirm password Error
      />
      <p className="input-error">Something go wrong</p>
      <AuthInput
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        title="Powtórz hasło"
        size="x-large"
      />
    </div>
  );
};

export default Credentials;

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
      <div className="authentication__form__wrapper__inputs__wrapper__input">
        <p className="authentication__form__wrapper__inputs__wrapper__input--error">
          dfsd
        </p>
        <AuthInput
          value={email}
          onChange={setEmail}
          title="E-mail"
          withOutMargin={true}
          size="x-large"
          //withoutMargin should be true only on password Error
        />
      </div>
      <div className="authentication__form__wrapper__inputs__wrapper__input">
        <p className="authentication__form__wrapper__inputs__wrapper__input--error">
          dsa
        </p>
        <AuthInput
          type="password"
          value={password}
          onChange={setPassword}
          title="Hasło"
          withOutMargin={true}
          size="x-large"
          //withoutMargin should be true only on confirm password Error
        />
      </div>
      <div className="authentication__form__wrapper__inputs__wrapper__input">
        <p className="authentication__form__wrapper__inputs__wrapper__input--error">
          das
        </p>
        <AuthInput
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          title="Powtórz hasło"
          size="x-large"
          withOutMargin={true}
        />
      </div>
    </div>
  );
};

export default Credentials;

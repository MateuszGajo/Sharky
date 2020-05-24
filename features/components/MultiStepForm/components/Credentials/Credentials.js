import React, { useContext } from "react";

import useTranslation from "next-translate/useTranslation";
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
  const { t } = useTranslation();

  const inputPassword = t("common:input.password");
  const inputConfirmPassword = t("common:input.confirm-password");
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
          size="x-large"
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
          title={inputPassword}
          size="x-large"
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
          title={inputConfirmPassword}
          size="x-large"
        />
      </div>
    </div>
  );
};

export default Credentials;

import React, { useContext } from "react";
import useTranslation from "next-translate/useTranslation";
import { WizzardContext } from "../../context/WizzardContext";
import AuthInput from "../../../../common/AuthInput/AuthInput";
import { GlobalContext } from "../../../../contex/globalContext";

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

  const {
    signUpValidation: { emailError, passwordError, confirmPasswordError },
  } = useContext(GlobalContext);

  const inputPassword = t("common:input.password");
  const inputConfirmPassword = t("common:input.confirm-password");
  return (
    <div className="authentication__form__wrapper__inputs__wrapper">
      <div className="authentication__form__wrapper__inputs__wrapper__input">
        {emailError && (
          <p className="authentication__form__wrapper__inputs__wrapper__input--error">
            {t(`signup:validation-errors.${emailError}`)}
          </p>
        )}
        <AuthInput
          value={email}
          onChange={setEmail}
          title="E-mail"
          size="x-large"
        />
      </div>
      <div className="authentication__form__wrapper__inputs__wrapper__input">
        {passwordError && (
          <p className="authentication__form__wrapper__inputs__wrapper__input--error">
            {t(`signup:validation-errors.${passwordError}`)}
          </p>
        )}
        <AuthInput
          type="password"
          value={password}
          onChange={setPassword}
          title={inputPassword}
          size="x-large"
        />
      </div>
      <div className="authentication__form__wrapper__inputs__wrapper__input">
        {confirmPasswordError && (
          <p className="authentication__form__wrapper__inputs__wrapper__input--error">
            {t(`signup:validation-errors.${confirmPasswordError}`)}
          </p>
        )}
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

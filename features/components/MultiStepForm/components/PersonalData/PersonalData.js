import React, { useContext } from "react";
import { WizzardContext } from "../../context/WizzardContext";
import AuthInput from "~common/AuthInput/AuthInput";
import AppContext from "~features/context/AppContext";
import i18next from "~i18n";
const { useTranslation } = i18next;

const PersonalData = () => {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phoneNumber,
    setPhoneNumber,
  } = useContext(WizzardContext);

  const {
    signUpValidation: { firstNameError, lastNameError, phoneNumberError },
  } = useContext(AppContext);

  const { t } = useTranslation(["signup"]);

  const inputFirstName = t("common:input.first-name");
  const inputLastName = t("common:input.last-name");
  const inputPhone = t("common:input.phone");
  return (
    <div className="authentication__form__wrapper__inputs__wrapper">
      <div className="authentication__form__wrapper__inputs__wrapper__input">
        {firstNameError && (
          <p className="authentication__form__wrapper__inputs__wrapper__input__error">
            {t(`signup:validation-errors.${firstNameError}`)}
          </p>
        )}
        <AuthInput
          value={firstName}
          onChange={setFirstName}
          title={inputFirstName}
          size="x-large"
        />
      </div>
      <div className="authentication__form__wrapper__inputs__wrapper__input">
        {lastNameError && (
          <p className="authentication__form__wrapper__inputs__wrapper__input__error">
            {t(`signup:validation-errors.${lastNameError}`)}
          </p>
        )}

        <AuthInput
          value={lastName}
          onChange={setLastName}
          title={inputLastName}
          size="x-large"
        />
      </div>
      <div className="authentication__form__wrapper__inputs__wrapper__input">
        {phoneNumberError && (
          <p className="authentication__form__wrapper__inputs__wrapper__input__error">
            {t(`signup:validation-errors.${phoneNumberError}`)}
          </p>
        )}

        <AuthInput
          value={phoneNumber}
          onChange={setPhoneNumber}
          title={inputPhone}
          size="x-large"
          withOutMargin={true}
        />
      </div>
    </div>
  );
};

export default PersonalData;

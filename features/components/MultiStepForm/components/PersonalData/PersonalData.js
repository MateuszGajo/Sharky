import React, { useContext } from "react";
import useTranslation from "next-translate/useTranslation";
import { WizzardContext } from "../../context/WizzardContext";
import AuthInput from "../../../../common/AuthInput/AuthInput";

const PersonalData = () => {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phoneNumber,
    setPhoneNumber,
  } = useContext(WizzardContext);

  const { t } = useTranslation();

  const inputFirstName = t("common:input.first-name");
  const inputLastName = t("common:input.last-name");
  const inputPhone = t("common:input.phone");
  return (
    <div className="authentication__form__wrapper__inputs__wrapper">
      <div className="authentication__form__wrapper__inputs__wrapper__input">
        <p className="authentication__form__wrapper__inputs__wrapper__input--error">
          {/* error text */}
        </p>
        <AuthInput
          value={firstName}
          onChange={setFirstName}
          title={inputFirstName}
          size="x-large"
        />
      </div>
      <div className="authentication__form__wrapper__inputs__wrapper__input">
        <p className="authentication__form__wrapper__inputs__wrapper__input--error"></p>
        <AuthInput
          value={lastName}
          onChange={setLastName}
          title={inputLastName}
          size="x-large"
        />
      </div>
      <div className="authentication__form__wrapper__inputs__wrapper__input">
        <p className="authentication__form__wrapper__inputs__wrapper__input--error"></p>
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

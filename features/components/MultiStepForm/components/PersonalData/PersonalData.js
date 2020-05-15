import React, { useContext } from "react";
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
  return (
    <div className="authentication__form__wrapper__inputs__wrapper">
      <div className="authentication__form__wrapper__inputs__wrapper__input">
        <p className="authentication__form__wrapper__inputs__wrapper__input--error">
          {/* error text */}
        </p>
        <AuthInput
          value={firstName}
          onChange={setFirstName}
          title="Imię"
          size="x-large"
          withOutMargin={true}
          //withoutMargin should be true only on lastname Error
        />
      </div>
      <div className="authentication__form__wrapper__inputs__wrapper__input">
        <p className="authentication__form__wrapper__inputs__wrapper__input--error">
          {/* error text */}
        </p>
        <AuthInput
          value={lastName}
          onChange={setLastName}
          title="Nazwisko"
          size="x-large"
          withOutMargin={true}
          //withoutMargin should be true only on phone Error
        />
      </div>
      <div className="authentication__form__wrapper__inputs__wrapper__input">
        <p className="authentication__form__wrapper__inputs__wrapper__input--error">
          {/* error text */}
        </p>
        <AuthInput
          value={phoneNumber}
          onChange={setPhoneNumber}
          title="Telefon"
          size="x-large"
          withOutMargin={true}
        />
      </div>
    </div>
  );
};

export default PersonalData;

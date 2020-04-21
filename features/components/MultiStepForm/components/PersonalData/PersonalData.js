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
      <AuthInput
        value={firstName}
        onChange={setFirstName}
        title="Imię"
        size="x-large"
        //withoutMargin should be true only on lastname Error
      />
      <AuthInput
        value={lastName}
        onChange={setLastName}
        title="Nazwisko"
        size="x-large"
        //withoutMargin should be true only on phone Error
      />
      <AuthInput
        value={phoneNumber}
        onChange={setPhoneNumber}
        title="Telefon"
        size="x-large"
      />
    </div>
  );
};

export default PersonalData;

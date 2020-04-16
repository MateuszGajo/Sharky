import React, { useContext } from "react";
import { WizzardContext } from "../../context/WizzardContext";
import InputAuth from "../../../../common/InputAuth/InputAuth";

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
      <InputAuth
        value={firstName}
        onChange={setFirstName}
        title="Imię"
        //withoutMargin should be true only on lastname Error
      />
      <InputAuth
        value={lastName}
        onChange={setLastName}
        title="Nazwisko"
        //withoutMargin should be true only on phone Error
      />
      <InputAuth
        value={phoneNumber}
        onChange={setPhoneNumber}
        title="Telefon"
      />
    </div>
  );
};

export default PersonalData;

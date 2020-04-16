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
      <InputAuth value={firstName} onChange={setFirstName} title="Imię" />
      <InputAuth value={lastName} onChange={setLastName} title="Nazwisko" />
      <InputAuth
        value={phoneNumber}
        onChange={setPhoneNumber}
        title="Telefon"
      />
    </div>
  );
};

export default PersonalData;

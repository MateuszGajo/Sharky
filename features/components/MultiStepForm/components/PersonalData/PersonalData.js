import React, { useContext } from "react";
import "./personalData.scss";
import { WizzardContext } from "../../context/WizzardContext";
const PersonalData = () => {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phoneNumber,
    setPhoneNumber
  } = useContext(WizzardContext);
  return (
    <div className="authentication__form__wrapper__inputs__wrapper">
      <div className="input-form">
        <input
          className="input-form--text"
          type="text"
          data-testid="firstname-input"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
        />
        <h2 className="input-form--placeholder">Imię</h2>
      </div>
      <div className="input-form">
        <input
          className="input-form--text"
          type="text"
          data-testid="lastname-input"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
        />
        <h2 className="input-form--placeholder">Nazwisko</h2>
      </div>
      <div className="input-form">
        <input
          className="input-form--text"
          type="text"
          data-testid="phonenumber-input"
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
          required
        />
        <h2 className="input-form--placeholder">Numer Telefonu</h2>
      </div>
    </div>
  );
};

export default PersonalData;

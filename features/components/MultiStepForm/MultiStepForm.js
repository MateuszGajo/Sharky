import React, { useState } from "react";
import axios from "axios";
import { WizzardContext } from "./context/WizzardContext";
import Controls from "./components/Controls/Controls";
import StepWrapper from "./components/StepWrapper/StepWrapper";
import Step from "./components/Step/Step";
import Credentials from "./components/Credentials/Credentials";
import PersonalData from "./components/PersonalData/PersonalData";

const Wizzard = ({ children }) => {
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [page, setPage] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/auth/signup", {
        email,
        password,
        firstName,
        lastName,
        phone: phoneNumber,
      })
      .then((resp) => console.log(resp))
      .catch((err) => console.log(err));
  };
  return (
    <WizzardContext.Provider
      value={{
        numberOfPages,
        setNumberOfPages,
        page,
        setPage,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        phoneNumber,
        setPhoneNumber,
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="authentication__form__wrapper__form"
      >
        {children}
      </form>
    </WizzardContext.Provider>
  );
};

export { Wizzard, Controls, StepWrapper, Step, Credentials, PersonalData };

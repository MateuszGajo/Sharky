import React, { useContext, useState, useEffect } from "react";
import { WizzardContext } from "./context/WizzardContext";
import Controls from "./components/Controls/Controls";
import StepWrapper from "./components/StepWrapper/StepWrapper";
import Step from "./components/Step/Step";
import Credentials from "./components/Credentials/Credentials";
import PersonalData from "./components/PersonalData/PersonalData";

const Wizzard = ({ children, onSubmit }) => {
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [page, setPage] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = e => {
    console.log("handleSubmit");
    e.preventDefault();
    onSubmit({
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phoneNumber
    });
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
        setPhoneNumber
      }}
    >
      <form onSubmit={handleSubmit}>{children}</form>
    </WizzardContext.Provider>
  );
};

export { Wizzard, Controls, StepWrapper, Step, Credentials, PersonalData };

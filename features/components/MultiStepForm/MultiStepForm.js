import React, { useState, useContext } from "react";
import Router from "next/router";
import { WizzardContext } from "./context/WizzardContext";
import Controls from "./components/Controls/Controls";
import StepWrapper from "./components/StepWrapper/StepWrapper";
import Step from "./components/Step/Step";
import Credentials from "./components/Credentials/Credentials";
import PersonalData from "./components/PersonalData/PersonalData";
import AppContext from "@features/context/AppContext";
import { signUp } from "@features/service/Functions/index";
import i18next from "@i18n";

const { useTranslation } = i18next;

const Wizzard = ({ children }) => {
  const { t } = useTranslation(["signup"]);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [page, setPage] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const {
    validationSignUpError,
    authUserError,
    dispatch,
    setValidationSignUpError,
    setError,
  } = useContext(AppContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const creds = {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phoneNumber,
    };
    signUp({
      creds,
      dispatch,
      setValidationSignUpError,
      Router,
      setError,
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
        setPhoneNumber,
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="authentication__form__wrapper__form"
      >
        {validationSignUpError && (
          <p className="input-error">
            {t(`signup:validation-errors.${validationSignUpError}`)}
          </p>
        )}
        {authUserError && (
          <p className="input-error">{t(`signup:error.${authUserError}`)}</p>
        )}
        {children}
      </form>
    </WizzardContext.Provider>
  );
};

export { Wizzard, Controls, StepWrapper, Step, Credentials, PersonalData };

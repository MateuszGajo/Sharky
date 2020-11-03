import React, { useState, useContext, useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import PrimaryInput from "@common/PrimaryInput/PrimaryInput";
import PrimaryButton from "@common/PrimaryButton/PrimaryButton";
import SettingsContext from "../../../context/SettingsContext";
import AppContext from "@features/context/AppContext";
import {
  getCountries,
  getLanguages,
  getValue,
  changeValue,
  changeValueWithConfirmPassword,
  validateField,
} from "../../services/functions";
import i18next from "@i18n";

const { useTranslation, i18n } = i18next;

const Item = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation(["settings"]);

  const changeText = t("settings:change");
  const confirmPasswordText = t("settings:account.confirm-password");

  const [value, setValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countries, setCountries] = useState([{ name: null, value: null }]);
  const [languages, setLanguages] = useState([{ name: null, value: null }]);
  const [error, setError] = useState("");
  const {
    buttonText,
    title,
    type,
    name,
    setName,
    setOpenConfirmPopUp,
    userPassword,
    setConfirmPopUpError,
  } = useContext(SettingsContext);
  const { setPrompt } = useContext(AppContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validateMessage = validateField(
      type,
      value,
      name,
      countries,
      languages,
      confirmPassword,
      setOpenConfirmPopUp
    );
    if (validateMessage) return setError(validateMessage);

    type === "general" &&
      changeValue(
        name,
        value,
        countries,
        languages,
        t,
        setPrompt,
        setName,
        setError,
        language,
        i18n
      );
  };

  useEffect(() => {
    userPassword &&
      changeValueWithConfirmPassword(
        name,
        value,
        userPassword,
        setOpenConfirmPopUp,
        setConfirmPopUpError,
        t,
        setPrompt,
        setName
      );
  }, [userPassword]);

  useEffect(() => {
    if (error) setError("");

    if (name !== "password") getValue(t, name, type, setValue);
    else setValue("");

    name === "country" && getCountries(t, setCountries);
    name === "language" && getLanguages(t, setLanguages);
  }, [name]);

  return (
    <div className="settings__container__display">
      <h1 className="settings__container__display__title">
        {changeText + " " + title}
        <span
          className="settings__container__display__title__icon"
          onClick={() => setName("")}
        >
          <IoMdArrowBack />
        </span>
      </h1>
      <form
        className="settings__container__display__form"
        onSubmit={handleSubmit}
      >
        <div className="settings__container__display__form__input">
          <PrimaryInput
            value={value}
            onChange={setValue}
            type={name === "password" ? "password" : "text"}
            size="x-large"
            title={title}
            withOutMargin={true}
            autocompleteData={
              name === "country"
                ? countries
                : name === "language"
                ? languages
                : []
            }
          />
        </div>
        {name === "password" ? (
          <div className="settings__container__display__form__input">
            <PrimaryInput
              value={confirmPassword}
              type="password"
              onChange={setConfirmPassword}
              title={confirmPasswordText}
              size="x-large"
            />
          </div>
        ) : null}
        <div className="settings__container__display__form__button">
          <PrimaryButton value={buttonText} />
        </div>
        <p className="settings__container__display__form__error">
          {error && t(`settings:errors.${error}`)}
        </p>
      </form>
    </div>
  );
};

export default Item;

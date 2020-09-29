import React, { useState, useEffect, useContext } from "react";
import { IoMdArrowBack } from "react-icons/io";
import PrimaryButton from "@common/PrimaryButton/PrimaryButton";
import PrimaryInput from "@common/PrimaryInput/PrimaryInput";
import i18next from "@i18n";
import axios from "axios";
import AppContext from "@features/context/AppContext";
import countryCode from "@root/utils/countryCode";
const { useTranslation, i18n } = i18next;

const Display = ({
  settings,
  setSettings,
  inputValue,
  setInputValue,
  confirmPassword,
  setConfirmPassword,
  setOpenConfirmPopUp,
  setConfirmUser,
  confirmUser,
  userSettings,
  setUserSettings,
}) => {
  const { name } = settings;
  const {
    t,
    i18n: { language },
  } = useTranslation(["settings"]);

  const { setError, setPrompt, socket } = useContext(AppContext);

  const [countries, setCountries] = useState([]);
  const [languages, setLanguages] = useState([]);

  const title = t(
    `settings:${settings.category == "account" ? "account" : "general"}.${
      settings.title
    }`
  );
  const changeText = t("settings:change");
  const informationText = t("settings:information.title");
  const descriptionText = t("settings:information.description");
  const confirmPasswordText = t("settings:account.confirm-password");
  const buttonText = t("settings:button");

  useEffect(() => {
    name == "country" &&
      axios.get("/country/get").then(({ data: { countries: data } }) => {
        const countries = data.map((item) => {
          const { name } = item;
          return {
            name,
            value: t(`settings:countries.${name}`),
          };
        });
        setCountries(countries);
      });

    name == "language" &&
      axios.get("/language/get").then(({ data: { languages: data } }) => {
        const languages = data.map((item) => {
          const { name } = item;
          return {
            name,
            value: t(`settings:languages.${name}`),
          };
        });
        setLanguages(languages);
      });
  }, [name]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (settings.category === "account") {
      if (settings.name == "password" && inputValue != confirmPassword)
        return setError("passwords-do-not-match");

      const emailRegex = /^([a-zA-Z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
      if (settings.name == "email" && !emailRegex.test(inputValue))
        return setError("invalid-value");

      const numberRegex = /\d{3}[\s-]?\d{3}[\s-]?\d{3}$/;
      if (settings.name == "phone" && !numberRegex.test(inputValue))
        return setError("invalid-value");

      setOpenConfirmPopUp(true);
    } else if (settings.category === "general") {
      const value = (settings.name == "country"
        ? countries
        : settings.name == "language" && languages
      ).find(
        (item) =>
          item.value.toLowerCase().trim() == inputValue.toLowerCase().trim()
      );

      if (!value) return setError("invalid-value");
      axios
        .post(`/user/change/${settings.name}`, { value: value.name })
        .then(() => {
          const choseCountryCode = countryCode(value.name.toLowerCase());
          if (settings.name == "language" && language != choseCountryCode)
            i18n.changeLanguage(choseCountryCode);

          console.log(t("settings:countries.poland"));
          const newUserSetting = {
            account: [...userSettings.account],
            general: userSettings.general.map((setting) => {
              return setting.name === settings.name
                ? {
                    ...setting,
                    value: value.name,
                  }
                : setting;
            }),
          };

          setUserSettings(newUserSetting);
          setPrompt(t(`settings:general.${settings.name}-changed`));
          setSettings({ name: "", value: "" });
        })
        .catch(({ response }) => console.log(response));
    }
  };

  useEffect(() => {
    if (confirmUser === true) {
      axios
        .post(`/user/change/${settings.name}`, { value: inputValue })
        .then(({ data: { userId } }) => {
          if (userId) {
            return socket.emit("changedPassword", { userId });
          }
          const newUserSetting = {
            account: userSettings.account.map((item) => {
              return item.name === settings.name
                ? { ...item, value: inputValue }
                : item;
            }),
            general: [...userSettings.general],
          };
          setPrompt(t(`settings:account.${settings.name}-changed`));
          setUserSettings(newUserSetting);
          setConfirmUser(false);
          setSettings({ name: "", value: "" });
        });
    }
  }, [confirmUser]);

  return (
    <>
      {name !== "" ? (
        <div className="settings__container__display">
          <h1 className="settings__container__display__title">
            {changeText + " " + title}
            <span
              className="settings__container__display__title__icon"
              onClick={() => setSettings({ name: "", value: "" })}
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
                value={inputValue}
                onChange={setInputValue}
                type={settings.name === "password" ? "password" : "text"}
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
            {settings.name === "password" ? (
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
          </form>
        </div>
      ) : (
        <div className="settings__container__reminder">
          <h1 className="settings__container__reminder__h1">
            {informationText}
          </h1>
          <p className="settings__container__reminder__p">{descriptionText}</p>
        </div>
      )}
    </>
  );
};

export default Display;

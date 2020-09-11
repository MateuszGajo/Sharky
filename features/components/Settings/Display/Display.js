import React, { useState, useEffect, useContext } from "react";
import { IoMdArrowBack } from "react-icons/io";
import PrimaryButton from "@common/PrimaryButton/PrimaryButton";
import PrimaryInput from "@common/PrimaryInput/PrimaryInput";
import i18next from "@i18n";
import axios from "axios";
import AppContext from "@features/context/AppContext";
import CountryCode from "../Utils/CountryCode";
const { useTranslation, i18n } = i18next;

const Display = ({
  chooseSetting,
  setChooseSetting,
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
  const { name } = chooseSetting;
  const {
    t,
    i18n: { language },
  } = useTranslation(["settings"]);

  const { setError, setPrompt, socket } = useContext(AppContext);

  const [countries, setCountries] = useState([]);
  const [languages, setLanguages] = useState([]);

  const title = t(
    `settings:${chooseSetting.category == "account" ? "account" : "general"}.${
      chooseSetting.title
    }`
  );
  const changeTitle = t("settings:change");
  const informationTitle = t("settings:information.title");
  const informationDescription = t("settings:information.description");
  const confirmPasswordName = t("settings:account.confirm-password");
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
    if (chooseSetting.category === "account") {
      if (chooseSetting.name == "password" && inputValue != confirmPassword)
        return setError("passwords-do-not-match");

      const emailRegex = /^([a-zA-Z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
      if (chooseSetting.name == "email" && !emailRegex.test(inputValue))
        return setError("invalid-value");

      const numberRegex = /\d{3}[\s-]?\d{3}[\s-]?\d{3}$/;
      if (chooseSetting.name == "phone" && !numberRegex.test(inputValue))
        return setError("invalid-value");

      setOpenConfirmPopUp(true);
    } else if (chooseSetting.category === "general") {
      const value = (chooseSetting.name == "country"
        ? countries
        : chooseSetting.name == "language" && languages
      ).find(
        (item) =>
          item.value.toLowerCase().trim() == inputValue.toLowerCase().trim()
      );

      if (!value) return setError("invalid-value");
      axios
        .post(`/user/change/${chooseSetting.name}`, { value: value.name })
        .then(() => {
          const choseCountryCode = CountryCode(value.name.toLowerCase());
          if (chooseSetting.name == "language" && language != choseCountryCode)
            i18n.changeLanguage(choseCountryCode);

          console.log(t("settings:countries.poland"));
          const newUserSetting = {
            account: [...userSettings.account],
            general: userSettings.general.map((setting) => {
              return setting.name === chooseSetting.name
                ? {
                    ...setting,
                    value: value.name,
                  }
                : setting;
            }),
          };

          setUserSettings(newUserSetting);
          setPrompt(t(`settings:general.${chooseSetting.name}-changed`));
          setChooseSetting({ name: "", value: "" });
        })
        .catch(({ response }) => console.log(response));
    }
  };

  useEffect(() => {
    if (confirmUser === true) {
      axios
        .post(`/user/change/${chooseSetting.name}`, { value: inputValue })
        .then(({ data: { idUser } }) => {
          if (idUser) {
            return socket.emit("changedPassword", { idUser });
          }
          const newUserSetting = {
            account: userSettings.account.map((item) => {
              return item.name === chooseSetting.name
                ? { ...item, value: inputValue }
                : item;
            }),
            general: [...userSettings.general],
          };
          setPrompt(t(`settings:account.${chooseSetting.name}-changed`));
          setUserSettings(newUserSetting);
          setConfirmUser(false);
          setChooseSetting({ name: "", value: "" });
        });
    }
  }, [confirmUser]);

  return (
    <>
      {name !== "" ? (
        <div className="settings__container__display">
          <h1 className="settings__container__display--title">
            {changeTitle + " " + title}
            <span
              className="settings__container__display--title--icon"
              onClick={() => setChooseSetting({ name: "", value: "" })}
            >
              <IoMdArrowBack />
            </span>
          </h1>
          <form
            className="settings__container__display--form"
            onSubmit={handleSubmit}
          >
            <div className="settings__container__display--form--input">
              <PrimaryInput
                value={inputValue}
                onChange={setInputValue}
                type={chooseSetting.name === "password" ? "password" : "text"}
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
            {chooseSetting.name === "password" ? (
              <div className="settings__container__display--form--input">
                <PrimaryInput
                  value={confirmPassword}
                  type="password"
                  onChange={setConfirmPassword}
                  title={confirmPasswordName}
                  size="x-large"
                />
              </div>
            ) : null}
            <div className="settings__container__display--form--button">
              <PrimaryButton value={buttonText} />
            </div>
          </form>
        </div>
      ) : (
        <div className="settings__container__reminder">
          <h1 className="settings__container__reminder--h1">
            {informationTitle}
          </h1>
          <p className="settings__container__reminder--p">
            {informationDescription}
          </p>
        </div>
      )}
    </>
  );
};

export default Display;

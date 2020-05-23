import React from "react";
import { IoMdArrowBack } from "react-icons/io";
import useTranslation from "next-translate/useTranslation";
import PrimaryButton from "../../../common/PrimaryButton/PrimaryButton";
import PrimaryInput from "../../../common/PrimaryInput/PrimaryInput";

const Display = ({
  chooseSetting,
  setChooseSetting,
  handleSubmit,
  inputValue,
  setInputValue,
  confirmPassword,
  setConfirmPassword,
  countries,
  languages,
}) => {
  const { name, title } = chooseSetting;
  const { t } = useTranslation();

  const changeTitle = t("settings:change");
  const informationTitle = t("settings:information.title");
  const informationDescription = t("settings:information.description");
  const confirmPasswordName = t("settings:account.confirm-password");
  const buttonText = t("settings:button");

  return (
    <>
      {name !== "" ? (
        <div className="settings__container__display">
          <h1 className="settings__container__display--title">
            {changeTitle + " " + chooseSetting.title}
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
                size="x-large"
                title={chooseSetting.title}
                withOutMargin={true}
                autocompleteData={
                  name === "country"
                    ? countries
                    : name === "language"
                    ? languages
                    : {}
                }
              />
            </div>
            {chooseSetting.name === "password" ? (
              <div className="settings__container__display--form--input">
                <PrimaryInput
                  value={confirmPassword}
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

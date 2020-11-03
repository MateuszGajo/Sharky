import React, { useState } from "react";
import SettingsContext from "./context/SettingsContext";
import i18next from "@i18n";

const { useTranslation } = i18next;

const withSettings = (Component) => {
  const Wrapped = () => {
    const { t } = useTranslation(["settings"]);
    const buttonText = t("settings:button");

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");
    const [confirmUser, setConfirmUser] = useState(false);
    const [userPassword, setUserPassword] = useState("");
    const [isOpenConfirmPopUp, setOpenConfirmPopUp] = useState(false);
    const [confirmPopUpError, setConfirmPopUpError] = useState("");

    return (
      <SettingsContext.Provider
        value={{
          buttonText,
          name,
          setName,
          type,
          setType,
          title,
          setTitle,
          confirmUser,
          setConfirmUser,
          userPassword,
          setUserPassword,
          isOpenConfirmPopUp,
          setOpenConfirmPopUp,
          confirmPopUpError,
          setConfirmPopUpError,
        }}
      >
        <Component />
      </SettingsContext.Provider>
    );
  };
  return Wrapped;
};

export default withSettings;

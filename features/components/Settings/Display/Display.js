import React, { useContext } from "react";
import SettingsContext from "../context/SettingsContext";
import Item from "./components/Item/Item";
import i18next from "@i18n";

const { useTranslation } = i18next;

const Display = () => {
  const { t } = useTranslation(["settings"]);
  const { name } = useContext(SettingsContext);

  const informationText = t("settings:information.title");
  const descriptionText = t("settings:information.description");

  return (
    <>
      {name !== "" ? (
        <Item />
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

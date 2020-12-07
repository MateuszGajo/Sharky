import React, { useState, useContext } from "react";
import cx from "classnames";
import { IoIosArrowDown } from "react-icons/io";
import i18next from "~i18n";
import SettingsContext from "../context/SettingsContext";
const { useTranslation } = i18next;

const Items = ({}) => {
  const { t } = useTranslation(["settings"]);

  const title = t("settings:title");
  const accountText = t("settings:account.title");
  const generalText = t("settings:general.title");

  const account = ["email", "password", "phone"];
  const general = ["country", "language"];

  const { setTitle, setName, setType } = useContext(SettingsContext);

  const [isAccountCollapsed, setStatusOfAccountCollapse] = useState(true);
  const [isGeneralCollapsed, setStatusOfGeneralCollapse] = useState(true);

  return (
    <div className="settings__container">
      <div className="settings__container__wrapper">
        <h1 className="settings__container__wrapper__title">{title}</h1>
        <div className="settings__container__wrapper__account">
          <div className="setting-title">
            <h3 className="setting-title__h3">{accountText}</h3>
            <div
              className={cx("setting-title__icon", {
                "setting-title__icon-active": !isAccountCollapsed,
              })}
              onClick={() => setStatusOfAccountCollapse(!isAccountCollapsed)}
            >
              <IoIosArrowDown />
            </div>
          </div>
          <div
            className={cx(
              "settings__container__wrapper__account__item setting-item",
              {
                "setting-collapse": isAccountCollapsed,
              }
            )}
          >
            {account.map((item, id) => {
              const title = t(`settings:account.${item}`);
              return (
                <div
                  className="settings__container__wrapper__account__item__item setting-item__container"
                  key={id}
                  onClick={() => {
                    setTitle(title);
                    setType("account");
                    setName(item);
                  }}
                >
                  {title}
                </div>
              );
            })}
          </div>
        </div>
        <div className="settings__container__wrapper__general">
          <div className="setting-title">
            <h3 className="setting-title__h3">{generalText}</h3>
            <div
              className={cx("setting-title__icon", {
                "setting-title__icon-active": !isGeneralCollapsed,
              })}
              onClick={() => setStatusOfGeneralCollapse(!isGeneralCollapsed)}
            >
              <IoIosArrowDown />
            </div>
          </div>
          <div
            className={cx(
              "settings__container__wrapper__general__item setting-item",
              {
                "setting-collapse": isGeneralCollapsed,
              }
            )}
          >
            {general.map((item, id) => {
              const title = t(`settings:general.${item}`);
              return (
                <div
                  className="settings__container__wrapper__general__item__item setting-item__container"
                  key={id}
                  onClick={() => {
                    setTitle(title);
                    setType("general");
                    setName(item);
                  }}
                >
                  {title}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Items;

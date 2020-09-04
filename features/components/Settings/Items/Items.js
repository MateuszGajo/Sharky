import React from "react";
import cx from "classnames";
import { IoIosArrowDown } from "react-icons/io";
import i18next from "@i18n";
const { useTranslation } = i18next;

const Items = ({
  isAccountCollapsed,
  setStatusOfAccountCollapse,
  userSettings,
  setChooseSetting,
  setInputValue,
  isGeneralCollapsed,
  setStatusOfGeneralCollapse,
}) => {
  const { t } = useTranslation(["settings"]);

  const title = t("settings:title");
  const accountTitle = t("settings:account.title");

  const generalTitle = t("settings:general.title");

  return (
    <div className="settings__container">
      <div className="settings__container__wrapper">
        <h1 className="settings__container__wrapper--title">{title}</h1>
        <div className="settings__container__wrapper__account">
          <div className="setting-title">
            <h3 className="setting-title--h3">{accountTitle}</h3>
            <div
              className={cx("setting-title--icon", {
                "setting-title--icon-active": !isAccountCollapsed,
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
            {userSettings.account.map((setting) => {
              const { name, id, value } = setting;
              return (
                <div
                  className="settings__container__wrapper__account__item__item setting-item__container"
                  key={id}
                  onClick={() => {
                    setChooseSetting({ ...setting, title: name });
                    setInputValue(value);
                  }}
                >
                  {t(`settings:account.${name}`)}
                </div>
              );
            })}
          </div>
        </div>
        <div className="settings__container__wrapper__general">
          <div className="setting-title">
            <h3 className="setting-title--h3">{generalTitle}</h3>
            <div
              className={cx("setting-title--icon", {
                "setting-title--icon-active": !isGeneralCollapsed,
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
            {userSettings.general.map((setting) => {
              const { name, id, value } = setting;
              return (
                <div
                  className="settings__container__wrapper__general__item__item setting-item__container"
                  key={id}
                  onClick={() => {
                    setChooseSetting({ ...setting, title: name });
                    if (!value) setInputValue("");
                    else if (name == "country")
                      setInputValue(t(`settings:countries.${value}`));
                    else if (name === "language")
                      setInputValue(t(`settings:languages.${value}`));
                  }}
                >
                  {t(`settings:general.${name}`)}
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

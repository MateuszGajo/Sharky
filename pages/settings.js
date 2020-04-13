import React, { useState } from "react";
import { IoIosArrowDown, IoMdArrowBack } from "react-icons/io";
import cx from "classnames";
import * as HomeLayout from "../features/components/Layout/Home/Compound/HomeLayoutCompound";
import ConfirmUser from "../features/common/PopUp/ConfirmUser/ConfirmUser";
import "./styles/main.scss";

const Settings = () => {
  const [isAccountCollapsed, setStatusOfAccountCollapse] = useState(true);
  const [isGeneralCollapsed, setStatusOfGeneralCollapse] = useState(true);
  const [settingValue, setSettingValue] = useState({
    value: "",
  });
  const [chooseSetting, setChooseSetting] = useState({
    name: "",
    title: "",
    category: "",
    value: "",
  });

  const userSettings = {
    account: [
      {
        name: "email",
        title: "E-mail",
        value: "example@example.com",
        category: "account",
        id: 1,
      },
      {
        name: "password",
        title: "Hasło",
        value: "",
        category: "account",
        id: 2,
      },
      {
        name: "phone",
        title: "Telefon",
        value: "521-313-322",
        category: "account",
        id: 3,
      },
    ],
    general: [
      {
        name: "country",
        title: "Kraj",
        value: "Polska",
        category: "general",
        id: 1,
      },
      {
        name: "language",
        title: "Język",
        value: "Polski",
        category: "general",
        id: 2,
      },
    ],
  };

  const countries = ["Brytania", "Niemcy", "Polska", "Portugalia"];
  let autocompleteCountries = [];
  const languages = ["Angielski", "Niemiecki", "Polski", "Portugalski"];

  const handleInputChange = (e) => {
    if (e.target.name === "confirmPassword")
      setSettingValue({ ...settingValue, confirmPassword: e.target.value });
    else setSettingValue({ ...settingValue, value: e.target.value });
  };

  const hnadleSubmit = (e) => {
    e.preventDefault();
    if (chooseSetting.category === "account") {
    } else if (chooseSetting.category === "general") {
      let newSetting = {
        account: [...userSettings.account],
        general:
          chooseSetting.category !== "general"
            ? [...userSettings.general]
            : userSettings.general.map((setting) => {
                return setting.name === chooseSetting.name
                  ? { ...setting, value: settingValue.value }
                  : setting;
              }),
      };
      console.log(newSetting);
    }
  };

  return (
    <div className="settings-container">
      {/* <ConfirmUser /> */}
      <HomeLayout.NavBar />
      <div className="settings-container__settings">
        <div className="settings-container__settings__all">
          <h1 className="settings-container__settings__all--title">
            Ustawienia
          </h1>
          <div className="settings-container__settings__all__account">
            <div className="setting-title">
              <h3 className="settings-container__settings__all__account--title">
                Konto
              </h3>
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
                "settings-container__settings__all__account__item-container setting-item-container",
                {
                  "setting-section-collapse": isAccountCollapsed,
                }
              )}
            >
              {userSettings.account.map((setting) => (
                <div
                  className="settings-container__settings__all__account__item-container__item setting-item"
                  key={setting.id}
                  onClick={() => {
                    setChooseSetting(setting);
                    setSettingValue({ value: setting.value });
                  }}
                >
                  {setting.title}
                </div>
              ))}
            </div>
          </div>
          <div className="settings-container__settings__all__general">
            <div className="setting-title">
              <h3 className="settings-container__settings__all__general--title">
                Ogólne
              </h3>
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
                "settings-container__settings__all__general__item-container setting-item-container",
                {
                  "setting-section-collapse": isGeneralCollapsed,
                }
              )}
            >
              {userSettings.general.map((setting) => (
                <div
                  className="settings-container__settings__all__general__item-container__item setting-item"
                  key={setting.id}
                  onClick={() => {
                    setChooseSetting(setting);
                    setSettingValue({ value: setting.value });
                  }}
                >
                  {setting.title}
                </div>
              ))}
            </div>
          </div>
        </div>
        {chooseSetting.name !== "" ? (
          <div className="settings-container__settings__display">
            <h1 className="settings-container__settings__display--title">
              Zmień {chooseSetting.title}
              <span
                className="settings-container__settings__display--title--icon"
                onClick={() => setChooseSetting({ name: "", value: "" })}
              >
                <IoMdArrowBack />
              </span>
            </h1>
            <form
              className="settings-container__settings__display--form"
              onSubmit={hnadleSubmit}
            >
              <div className="settings-container__settings__display--form__data">
                <input
                  name={chooseSetting.title}
                  className="settings-container__settings__display--form__data--input"
                  value={settingValue.value}
                  onChange={handleInputChange}
                />

                <h4 className="settings-container__settings__display--form__data--title">
                  {chooseSetting.title}
                </h4>
                <div className="settings-container__settings__display--form__data__autocomplete">
                  <div className="settings-container__settings__display--form__data__autocomplete--item">
                    <span className="settings-container__settings__display--form__data__autocomplete--item--span">
                      Polska
                    </span>
                  </div>
                </div>
              </div>
              {chooseSetting.name === "password" ? (
                <div className="settings-container__settings__display--form__data">
                  <input
                    name="confirmPassword"
                    className="settings-container__settings__display--form__data--input"
                    value={settingValue.confirmPassword}
                    onChange={handleInputChange}
                  />

                  <h4 className="settings-container__settings__display--form__data--title">
                    Powtórz Hasło
                  </h4>
                </div>
              ) : null}

              <button className="settings-container__settings__display--form--button">
                Zapisz
              </button>
            </form>
          </div>
        ) : (
          <div className="settings-container__settings__reminder">
            <h1 className="settings-container__settings__reminder--h1">
              Pamiętaj
            </h1>
            <p className="settings-container__settings__reminder--p">
              Regularnie zmieniaj hasło, aby zapobiec kradzieży danych
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;

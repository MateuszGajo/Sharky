import React, { useState, useEffect } from "react";
import { IoIosArrowDown, IoMdArrowBack } from "react-icons/io";
import cx from "classnames";
import * as HomeLayout from "../features/components/Layout/Home/Compound/HomeLayoutCompound";
import ConfirmUser from "../features/common/PopUp/ConfirmUser/ConfirmUser";
import "./styles/main.scss";
import PrimaryButton from "../features/common/PrimaryButton/PrimaryButton";
import PrimaryInput from "../features/common/PrimaryInput/PrimaryInput";

const Settings = () => {
  const [isAccountCollapsed, setStatusOfAccountCollapse] = useState(true);
  const [isGeneralCollapsed, setStatusOfGeneralCollapse] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOpenConfirmPopUp, setOpenConfirmPopUp] = useState(false);
  const [confirmUser, setConfirmUser] = useState(false);
  const [settingValue, setSettingValue] = useState({
    value: "",
  });
  const [chooseSetting, setChooseSetting] = useState({
    name: "",
    title: "",
    category: "",
    value: "",
  });

  const [userSettings, setUserSettings] = useState({
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
  });

  const countries = ["Brytania", "Niemcy", "Polska", "Portugalia"];
  let autocompleteCountries = [];
  const languages = ["Angielski", "Niemiecki", "Polski", "Portugalski"];

  const hnadleSubmit = (e) => {
    e.preventDefault();
    if (chooseSetting.category === "account") {
      setOpenConfirmPopUp(true);
      setConfirmUser(true);
    } else if (chooseSetting.category === "general") {
      const newUserSetting = {
        account: [...userSettings.account],
        general: userSettings.general.map((setting) => {
          return setting.name === chooseSetting.name
            ? { ...setting, value: inputValue }
            : setting;
        }),
      };
      //save db
    }
  };

  useEffect(() => {
    if (confirmUser === true) {
      if (chooseSetting.name === "password") {
        if (inputValue !== confirmPassword) return setConfirmUser(false);
      }
      const newUserSetting = {
        account: userSettings.account.map((item) => {
          return item.name === chooseSetting.name
            ? { ...item, value: inputValue }
            : item;
        }),
        general: [...userSettings.general],
      };
      setConfirmUser(false);
    }
  }, [confirmUser]);

  return (
    <div className="settings-container">
      <ConfirmUser
        isOpen={isOpenConfirmPopUp}
        setOpen={setOpenConfirmPopUp}
        setVerify={setConfirmUser}
      />
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
                    setInputValue(setting.value);
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
                    setInputValue(setting.value);
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
              <div className="settings-container__settings__display--form--input">
                <PrimaryInput
                  value={inputValue}
                  onChange={setInputValue}
                  size="x-large"
                  title={chooseSetting.title}
                  withOutMargin={true}
                />
              </div>
              {chooseSetting.name === "password" ? (
                <div className="settings-container__settings__display--form--input">
                  <PrimaryInput
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    title="Powtórz hasło"
                    size="x-large"
                  />
                </div>
              ) : null}
              <div className="settings-container__settings__display--form--button">
                <PrimaryButton value="Zapisz" />
              </div>
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

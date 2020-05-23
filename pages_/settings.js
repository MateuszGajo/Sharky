import React, { useState, useEffect } from "react";
import useTranslation from "next-translate/useTranslation";
import * as HomeLayout from "../features/components/Layout/Home/Compound/HomeLayoutCompound";
import ConfirmUser from "../features/common/PopUp/ConfirmUser/ConfirmUser";
import Items from "../features/components/Settings/Items/Items";
import Display from "../features/components/Settings/Display/Display";
import "../styles/main.scss";

const Settings = ({
  countries = ["poland", "usa"],
  languages = ["english", "polish"],
}) => {
  const { t } = useTranslation();
  const [isAccountCollapsed, setStatusOfAccountCollapse] = useState(true);
  const [isGeneralCollapsed, setStatusOfGeneralCollapse] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOpenConfirmPopUp, setOpenConfirmPopUp] = useState(false);
  const [confirmUser, setConfirmUser] = useState(false);

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
        value: "poland",
        category: "general",
        id: 1,
      },
      {
        name: "language",
        title: "Język",
        value: "polish",
        category: "general",
        id: 2,
      },
    ],
  });

  // const countries = ["poland", "usa"];
  // let autocompleteCountries = [];
  languages = languages.map((language) => {
    return t(`settings:languages.${language}`);
  });
  countries = countries.map((country) => {
    return t(`settings:countries.${country}`);
  });

  const handleSubmit = (e) => {
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
    <div className="settings">
      <ConfirmUser
        isOpen={isOpenConfirmPopUp}
        setOpen={setOpenConfirmPopUp}
        setVerify={setConfirmUser}
      />
      <HomeLayout.NavBar />
      <div className="settings--desktop">
        <Items
          isAccountCollapsed={isAccountCollapsed}
          setStatusOfAccountCollapse={setStatusOfAccountCollapse}
          userSettings={userSettings}
          setChooseSetting={setChooseSetting}
          setInputValue={setInputValue}
          isGeneralCollapsed={isGeneralCollapsed}
          setStatusOfGeneralCollapse={setStatusOfGeneralCollapse}
        />
        <Display
          setChooseSetting={setChooseSetting}
          chooseSetting={chooseSetting}
          handleSubmit={handleSubmit}
          inputValue={inputValue}
          setInputValue={setInputValue}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          languages={languages}
          countries={countries}
        />
      </div>
      <div className="settings--mobile">
        {chooseSetting.name === "" ? (
          <Items
            isAccountCollapsed={isAccountCollapsed}
            setStatusOfAccountCollapse={setStatusOfAccountCollapse}
            userSettings={userSettings}
            setChooseSetting={setChooseSetting}
            setInputValue={setInputValue}
            isGeneralCollapsed={isGeneralCollapsed}
            setStatusOfGeneralCollapse={setStatusOfGeneralCollapse}
          />
        ) : (
          <Display
            setChooseSetting={setChooseSetting}
            chooseSetting={chooseSetting}
            handleSubmit={handleSubmit}
            inputValue={inputValue}
            setInputValue={setInputValue}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            languages={languages}
            countries={countries}
          />
        )}
      </div>
    </div>
  );
};

export default Settings;

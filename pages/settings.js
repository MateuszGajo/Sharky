import React, { useState, useContext } from "react";
import * as HomeLayout from "@components/Layout/Home/Compound/HomeLayoutCompound";
import ConfirmUser from "@common/PopUp/ConfirmUser/ConfirmUser";
import Items from "@components/Settings/Items/Items";
import Display from "@components/Settings/Display/Display";
import Error from "@common/PopUp/Error/Error";
import Prompt from "@common/PopUp/Prompt/Prompt";
import i18next from "@i18n";
import AppContext from "@features/context/AppContext";
import "../styles/main.scss";
const { useTranslation, i18n } = i18next;

const Settings = () => {
  const { t } = useTranslation(["settings"]);

  const { isPrompt, isError } = useContext(AppContext);

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

  return (
    <div className="settings">
      {/* <button onClick={() => i18n.changeLanguage("pl")}>click</button> */}
      {isError && <Error message={isError} />}
      {isPrompt && <Prompt message={isPrompt} />}
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
          inputValue={inputValue}
          setInputValue={setInputValue}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          setOpenConfirmPopUp={setOpenConfirmPopUp}
          setConfirmUser={setConfirmUser}
          confirmUser={confirmUser}
          userSettings={userSettings}
          setUserSettings={setUserSettings}
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
            inputValue={inputValue}
            setInputValue={setInputValue}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            setOpenConfirmPopUp={setOpenConfirmPopUp}
            setConfirmUser={setConfirmUser}
            confirmUser={confirmUser}
            userSettings={userSettings}
            setUserSettings={setUserSettings}
          />
        )}
      </div>
    </div>
  );
};

export default Settings;

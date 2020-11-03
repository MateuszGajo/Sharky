import React, { useState, useContext, useEffect } from "react";
import Router from "next/router";
import axios from "axios";
import NavBar from "@components/Layout/Home/Compound/components/NavBar/NavBar";
import ConfirmUser from "@common/PopUp/ConfirmUser/ConfirmUser";
import Items from "@components/Settings/Items/Items";
import Display from "@components/Settings/Display/Display";
import Error from "@common/PopUp/Error/Error";
import Prompt from "@common/PopUp/Prompt/Prompt";
import Spinner from "@components/Spinner/Spinner";
import AppContext from "@features/context/AppContext";
import { getOwner } from "@features/service/Functions/index";
import withSettings from "@components/Settings/withSettings";
import SettingsContext from "@components/Settings/context/SettingsContext";
import "@styles/settings.scss";

const Settings = () => {
  const { isPrompt, isError, setOwner } = useContext(AppContext);
  const {
    isOpenConfirmPopUp,
    setOpenConfirmPopUp,
    setConfirmUser,
    confirmUser,
    setUserPassword,
    confirmPopUpError,
  } = useContext(SettingsContext);

  const [isAccountCollapsed, setStatusOfAccountCollapse] = useState(true);
  const [isGeneralCollapsed, setStatusOfGeneralCollapse] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setStatusOfLoading] = useState(true);
  const [isAuth, setStatusOfAuth] = useState(null);
  const [settings, setSettings] = useState({
    name: "",
    title: "",
    category: "",
    value: "",
  });

  const [userSettings, setUserSettings] = useState();

  useEffect(() => {
    isAuth &&
      axios
        .get("/user/me/info")
        .then(({ data: { email, phone, language, country } }) => {
          const userSettings = {
            account: [
              {
                name: "email",
                title: "E-mail",
                value: email || "",
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
                value: phone || "",
                category: "account",
                id: 3,
              },
            ],
            general: [
              {
                name: "country",
                title: "Kraj",
                value: country || "",
                category: "general",
                id: 1,
              },
              {
                name: "language",
                title: "Język",
                value: language || "",
                category: "general",
                id: 2,
              },
            ],
          };

          setUserSettings(userSettings);
          setStatusOfLoading(false);
        });
  }, [isAuth]);

  useEffect(() => {
    getOwner({ setStatusOfAuth, setOwner });
  }, []);

  if (isAuth == null) return <Spinner />;
  else if (!isAuth) {
    Router.push("/signin");
    return <Spinner />;
  } else if (isLoading) return <Spinner />;

  return (
    <div className="settings">
      {isError && <Error message={isError} />}
      {isPrompt && <Prompt message={isPrompt} />}
      {isOpenConfirmPopUp && (
        <ConfirmUser
          setOpen={setOpenConfirmPopUp}
          setVerify={setConfirmUser}
          setValue={setUserPassword}
          popUpError={confirmPopUpError}
        />
      )}

      <NavBar />
      <div className="settings--desktop">
        <Items
          isAccountCollapsed={isAccountCollapsed}
          setStatusOfAccountCollapse={setStatusOfAccountCollapse}
          userSettings={userSettings}
          setSettings={setSettings}
          setInputValue={setInputValue}
          isGeneralCollapsed={isGeneralCollapsed}
          setStatusOfGeneralCollapse={setStatusOfGeneralCollapse}
        />
        <Display
          setSettings={setSettings}
          settings={settings}
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
        {settings.name === "" ? (
          <Items
            isAccountCollapsed={isAccountCollapsed}
            setStatusOfAccountCollapse={setStatusOfAccountCollapse}
            userSettings={userSettings}
            setSettings={setSettings}
            setInputValue={setInputValue}
            isGeneralCollapsed={isGeneralCollapsed}
            setStatusOfGeneralCollapse={setStatusOfGeneralCollapse}
          />
        ) : (
          <Display
            setSettings={setSettings}
            settings={settings}
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

export default withSettings(Settings);

import React, { useState, useContext, useEffect } from "react";
import Router from "next/router";
import axios from "axios";
import * as HomeLayout from "@components/Layout/Home/Compound/HomeLayoutCompound";
import ConfirmUser from "@common/PopUp/ConfirmUser/ConfirmUser";
import Items from "@components/Settings/Items/Items";
import Display from "@components/Settings/Display/Display";
import Error from "@common/PopUp/Error/Error";
import Prompt from "@common/PopUp/Prompt/Prompt";
import Spinner from "@components/Spinner/Spinner";
import AppContext from "@features/context/AppContext";
import { getOwner } from "@features/service/Functions/index";
import "../styles/settings.scss";

const Settings = () => {
  const { isPrompt, isError, setOwner } = useContext(AppContext);

  const [isAccountCollapsed, setStatusOfAccountCollapse] = useState(true);
  const [isGeneralCollapsed, setStatusOfGeneralCollapse] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOpenConfirmPopUp, setOpenConfirmPopUp] = useState(false);
  const [confirmUser, setConfirmUser] = useState(false);
  const [isLoading, setStatusOfLoading] = useState(true);
  const [isAuth, setStatusOfAuth] = useState(null);
  const [chooseSetting, setChooseSetting] = useState({
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
        <ConfirmUser setOpen={setOpenConfirmPopUp} setVerify={setConfirmUser} />
      )}

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

import React, { useState, useContext, useEffect } from "react";
import Router from "next/router";
import { useMediaQuery } from "react-responsive";
import NavBar from "@components/Layout/Home/Compound/components/NavBar/NavBar";
import ConfirmUser from "@common/PopUp/ConfirmUser/ConfirmUser";
import Items from "@components/Settings/Items/Items";
import Display from "@components/Settings/Display/Display";
import Spinner from "@components/Spinner/Spinner";
import PopUpHandlers from "@components/PopUpHandlers/PopUpHandlers";
import AppContext from "@features/context/AppContext";
import { getOwner } from "@features/service/Functions/index";
import withSettings from "@components/Settings/withSettings";
import SettingsContext from "@components/Settings/context/SettingsContext";
import { changeValueWithConfirmPassword } from "@components/Settings/Display/services/functions";
import i18next from "@i18n";
import "@styles/settings.scss";

const { useTranslation } = i18next;

const Settings = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 1023px)" });

  const { t } = useTranslation(["settings"]);
  const { isPrompt, setPrompt, isError, setOwner } = useContext(AppContext);
  const {
    isOpenConfirmPopUp,
    setOpenConfirmPopUp,
    confirmPopUpError,
    name,
    value,
    setName,
    setConfirmPopUpError,
  } = useContext(SettingsContext);

  const [isAuth, setStatusOfAuth] = useState(null);

  useEffect(() => {
    getOwner({ setStatusOfAuth, setOwner });
  }, []);

  if (isAuth == null) return <Spinner />;
  else if (!isAuth) {
    Router.push("/signin");
    return <Spinner />;
  }

  const changeValue = (password) => {
    changeValueWithConfirmPassword(
      name,
      value,
      password,
      setOpenConfirmPopUp,
      setConfirmPopUpError,
      t,
      setPrompt,
      setName
    );
  };

  return (
    <div className="settings">
      <PopUpHandlers />
      {isOpenConfirmPopUp && (
        <ConfirmUser
          setOpen={setOpenConfirmPopUp}
          setValue={changeValue}
          popUpError={confirmPopUpError}
        />
      )}
      <NavBar />
      {!isMobile ? (
        <div className="settings--desktop">
          <Items />
          <Display />
        </div>
      ) : (
        <div className="settings--mobile">
          {name === "" ? <Items /> : <Display />}
        </div>
      )}
    </div>
  );
};

export default withSettings(Settings);

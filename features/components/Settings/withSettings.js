import React, { useState } from "react";
import SettingsContext from "./context/SettingsContext";

const withSettings = (Component) => {
  const Wrapped = () => {
    const [value, setValue] = useState("");
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");
    const [isOpenConfirmPopUp, setOpenConfirmPopUp] = useState(false);
    const [confirmPopUpError, setConfirmPopUpError] = useState("");

    return (
      <SettingsContext.Provider
        value={{
          value,
          setValue,
          name,
          setName,
          type,
          setType,
          title,
          setTitle,
          isOpenConfirmPopUp,
          setOpenConfirmPopUp,
          confirmPopUpError,
          setConfirmPopUpError,
        }}
      >
        <Component />
      </SettingsContext.Provider>
    );
  };
  return Wrapped;
};

export default withSettings;

import React, { useContext, useState, useEffect } from "react";
import { WizzardContext } from "./context/WizzardContext";
import Controls from "./components/Controls/Controls";
import StepWrapper from "./components/StepWrapper/StepWrapper";
import Step from "./components/Step/Step";
import Credentials from "./components/Credentials/Credentials";
import PersonalData from "./components/PersonalData/PersonalData";

const Wizzard = ({ children }) => {
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [page, setPage] = useState(1);

  return (
    <WizzardContext.Provider
      value={{ numberOfPages, setNumberOfPages, page, setPage }}
    >
      {children}
    </WizzardContext.Provider>
  );
};

export { Wizzard, Controls, StepWrapper, Step, Credentials, PersonalData };

import React, { useContext } from "react";
import Error from "@common/PopUp/Error/Error";
import Prompt from "@common/PopUp/Prompt/Prompt";
import Report from "@common/PopUp/Report/Report";
import AppContext from "@features/context/AppContext";

const PopUpHandlers = () => {
  const { isPrompt, isError, report } = useContext(AppContext);
  return (
    <>
      {report.type && <Report type={report.type} id={report.id} />}
      {isError && <Error message={isError} />}
      {isPrompt && <Prompt message={isPrompt} />}
    </>
  );
};

export default PopUpHandlers;

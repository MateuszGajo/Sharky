import React, { useContext } from "react";
import Error from "@common/PopUp/Error/Error";
import Prompt from "@common/PopUp/Prompt/Prompt";
import AppContext from "@features/context/AppContext";

const PopUpHandlers = () => {
  const { isPrompt, isError } = useContext(AppContext);
  return (
    <>
      {isError && <Error message={isError} />}
      {isPrompt && <Prompt message={isPrompt} />}
    </>
  );
};

export default PopUpHandlers;

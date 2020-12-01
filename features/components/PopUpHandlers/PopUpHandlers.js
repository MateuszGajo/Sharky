import React, { useContext } from "react";
import Error from "@common/PopUp/Error/Error";
import Prompt from "@common/PopUp/Prompt/Prompt";
import Report from "@common/PopUp/Report/Report";
import PostPhoto from "@common/PopUp/PostPhoto/PostPhoto";
import AppContext from "@features/context/AppContext";

const PopUpHandlers = () => {
  const { isPrompt, isError, report, photoPopUp, setPhotoPopUp } = useContext(
    AppContext
  );

  return (
    <>
      {photoPopUp.photoSrc && (
        <PostPhoto
          src={photoPopUp.photoSrc}
          postId={photoPopUp.postId}
          setSrc={setPhotoPopUp}
          forward={photoPopUp.forward}
        />
      )}
      {report.type && <Report type={report.type} id={report.id} />}
      {isError && <Error message={isError} />}
      {isPrompt && <Prompt message={isPrompt} />}
    </>
  );
};

export default PopUpHandlers;

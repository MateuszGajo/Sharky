import React, { useContext } from "react";
import { MdErrorOutline } from "react-icons/md";
import AppContext from "../../../context/AppContext";
import i18next from "../../../../i18n/server";
import { useEffect } from "react";
const { useTranslation } = i18next;

const Error = ({ message }) => {
  const { t } = useTranslation();

  const ErrorText = t(`common:pop-up.error.${message}`);
  const { setStatusOfError } = useContext(AppContext);
  const handleClick = () => {
    console.log("click");
  };

  useEffect(() => {
    setTimeout(() => {
      setStatusOfError({ occur: false, message: "" });
    }, 1200);
  });

  return (
    <section className="error" onClick={handleClick}>
      <div className="error__container" onClick={(e) => e.stopPropagation()}>
        <div className="error__container__icon">
          <MdErrorOutline />
        </div>
        <div className="error__container__text">
          <span className="error__container__text--span">{ErrorText}</span>
        </div>
      </div>
    </section>
  );
};

export default Error;

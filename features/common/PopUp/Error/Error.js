import React, { useContext } from "react";
import { MdErrorOutline } from "react-icons/md";
import AppContext from "@features/context/AppContext";
import i18next from "@i18n";
import { useEffect } from "react";
const { useTranslation } = i18next;

const Error = ({ message }) => {
  const { t } = useTranslation();

  const ErrorText = t(`common:pop-up.error.${message}`);
  const { setError } = useContext(AppContext);

  useEffect(() => {
    const hidePopUp = setTimeout(() => {
      setError("");
    }, 1200);

    return () => {
      clearTimeout(hidePopUp);
    };
  });

  return (
    <section className="error">
      <div className="error__container" onClick={(e) => e.stopPropagation()}>
        <div className="error__container__icon">
          <MdErrorOutline />
        </div>
        <div className="error__container__text">
          <span className="error__container__text__span">{ErrorText}</span>
        </div>
      </div>
    </section>
  );
};

export default Error;

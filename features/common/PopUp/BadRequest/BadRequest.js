import React, { useContext } from "react";
import { MdErrorOutline } from "react-icons/md";
import AppContext from "../../../context/AppContext";
import i18next from "../../../../i18n";
import { useEffect } from "react";
const { useTranslation } = i18next;

const BadRequest = () => {
  const { t } = useTranslation();

  const badRequestText = t("common:pop-up.bad-request.text");
  const { setStatusOfBadRequest } = useContext(AppContext);
  const handleClick = () => {
    console.log("click");
  };

  useEffect(() => {
    setTimeout(() => {
      setStatusOfBadRequest(false);
    }, 1200);
  });

  return (
    <section className="bad-request" onClick={handleClick}>
      <div
        className="bad-request__container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bad-request__container__icon">
          <MdErrorOutline />
        </div>
        <div className="bad-request__container__text">
          <span className="bad-request__container__text--span">
            {badRequestText}
          </span>
        </div>
      </div>
    </section>
  );
};

export default BadRequest;

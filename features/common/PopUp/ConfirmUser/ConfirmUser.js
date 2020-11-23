import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { IoMdClose } from "react-icons/io";
import PrimaryInput from "@common/PrimaryInput/PrimaryInput";
import PrimaryButton from "@common/PrimaryButton/PrimaryButton";
import i18next from "@i18n";

const { useTranslation } = i18next;

const ConfirmUser = ({ setOpen, setValue, popUpError }) => {
  const { t } = useTranslation();

  const title = t("common:pop-up.confirm-user.title");
  const buttonText = t("common:pop-up.confirm-user.button");
  const inputPasswordText = t("common:input.password");

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    error & setError(popUpError);
  }, [popUpError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValue(password);
  };
  return (
    <div className="confrim-user-container">
      <div className="confrim-user-container__content">
        <div
          className="confrim-user-container__content__icon"
          data-testid="close-icon"
          onClick={() => setOpen(false)}
        >
          <IoMdClose />
        </div>

        <div className="confrim-user-container__content__title">
          <h3 className="confrim-user-container__content__title__h3">
            {title}
          </h3>
        </div>
        <div className="confrim-user-container__content__data">
          <form
            className="confrim-user-container__content__data__form"
            onSubmit={handleSubmit}
          >
            <div className="confrim-user-container__content__data__form__input">
              <PrimaryInput
                value={password}
                type="password"
                onChange={setPassword}
                title={inputPasswordText}
              />
            </div>
            <div className="confrim-user-container__content__data__form__button">
              <PrimaryButton value={buttonText} />
            </div>
            {error && (
              <p className="confrim-user-container__content__data__form__error">
                {t(`common:pop-up.confirm-user.${error}`)}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

ConfirmUser.propTypes = {
  setOpen: PropTypes.func,
  setValue: PropTypes.func,
  popUpError: PropTypes.string,
};

export default ConfirmUser;

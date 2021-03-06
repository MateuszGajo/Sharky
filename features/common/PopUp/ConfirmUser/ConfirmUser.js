import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { IoMdClose } from "react-icons/io";
import PrimaryInput from "~common/PrimaryInput/PrimaryInput";
import PrimaryButton from "~common/PrimaryButton/PrimaryButton";
import i18next from "~i18n";
import AppContext from "~features/context/AppContext";

const { useTranslation } = i18next;

const ConfirmUser = ({ setOpen, setValue }) => {
  const { t } = useTranslation();

  const title = t("common:pop-up.confirm-user.title");
  const buttonText = t("common:pop-up.confirm-user.button");
  const inputPasswordText = t("common:input.password");

  const { confirmPopUpError } = useContext(AppContext);

  const [password, setPassword] = useState("");

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
          aria-hidden="true"
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
            {confirmPopUpError && (
              <p className="confrim-user-container__content__data__form__error">
                {t(`common:pop-up.confirm-user.${confirmPopUpError}`)}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

ConfirmUser.propTypes = {
  setOpen: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default ConfirmUser;

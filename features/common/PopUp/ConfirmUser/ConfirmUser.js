import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import cx from "classnames";
import useTranslation from "next-translate/useTranslation";
import PrimaryInput from "../../PrimaryInput/PrimaryInput";
import PrimaryButton from "../../PrimaryButton/PrimaryButton";

const ConfirmUser = ({ setVerify, isOpen = true, setOpen }) => {
  const { t } = useTranslation();
  const title = t("common:pop-up.confirm-user.title");
  const buttonText = t("common:pop-up.confirm-user.button");
  const inputPasswordText = t("common:input.password");

  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    //check, is password correct. setVerify(true) if is it correct.
  };
  return (
    <div
      data-testid="confrim-user-container"
      className={cx("confrim-user-container", {
        "is-close": !isOpen,
      })}
    >
      <div className="confrim-user-container__content">
        <div
          className="confrim-user-container__content--icon"
          onClick={() => setOpen(false)}
        >
          <IoMdClose />
        </div>

        <div className="confrim-user-container__content--title">
          <h3 className="confrim-user-container__content--title--h3">
            {title}
          </h3>
        </div>
        <div className="confrim-user-container__content__data">
          <form
            className="confrim-user-container__content__data__form"
            onSubmit={handleSubmit}
          >
            <PrimaryInput
              value={password}
              onChange={setPassword}
              title={inputPasswordText}
            />
            <div className="confrim-user-container__content__data__form--button">
              <PrimaryButton value={buttonText} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmUser;

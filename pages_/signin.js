import React, { useState } from "react";
import Authentication from "../features/components/Layout/Authentication/Authentication";
import { FaGooglePlusG, FaFacebookF } from "react-icons/fa";
import { FiTwitter } from "react-icons/fi";
import useTranslation from "next-translate/useTranslation";
import Checkbox from "../features/common/Checkbox/Checkbox";
import PrimaryButton from "../features/common/PrimaryButton/PrimaryButton";
import AuthInput from "../features/common/AuthInput/AuthInput";
import "../styles/main.scss";

const SignIn = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRembermeChecked, setStatusOfRemberme] = useState(false);

  const { t } = useTranslation();

  const inputPassword = t("common:input.password");
  const description = t("signin:description");
  const remindPassword = t("signin:forget");
  const buttonText = t("signin:button");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      email,
      password,
    });
  };
  return (
    <Authentication type="signin">
      <>
        <div className="authentication__form__wrapper__icons">
          <div className="authentication__form__wrapper__icons__icon">
            <a
              href="/auth/google"
              class="authentication__form__wrapper__icons__icon--link"
            >
              <FaGooglePlusG />
            </a>
          </div>
          <div className="authentication__form__wrapper__icons__icon">
            <a
              href="/auth/twitter"
              class="authentication__form__wrapper__icons__icon--link"
            >
              <FiTwitter />
            </a>
          </div>
          <div className="authentication__form__wrapper__icons__icon">
            <a
              href="/auth/facebook"
              class="authentication__form__wrapper__icons__icon--link"
            >
              <FaFacebookF />
            </a>
          </div>
        </div>
        <p className="authentication__form__wrapper--text">{description}</p>
        <div className="authentication__form__wrapper__inputs">
          <form
            className="authentication__form__wrapper__inputs__wrapper"
            onSubmit={handleSubmit}
          >
            <AuthInput
              value={email}
              onChange={setEmail}
              title="E-mail"
              size="x-large"
            />
            <AuthInput
              type="password"
              value={password}
              onChange={setPassword}
              title={inputPassword}
              size="x-large"
            />

            <div className="authentication__form__wrapper__inputs__wrapper__helpers">
              <div className="authentication__form__wrapper__inputs__wrapper__helpers--remberme">
                <Checkbox
                  value={isRembermeChecked}
                  onChange={setStatusOfRemberme}
                />
              </div>

              <span className="authentication__form__wrapper__inputs__wrapper__helpers--remberme--text">
                {remindPassword}
              </span>
            </div>
            <div className="authentication__form__wrapper__inputs__wrapper--button">
              <PrimaryButton value={buttonText} size="large" />
            </div>
          </form>
        </div>
      </>
    </Authentication>
  );
};

export default SignIn;

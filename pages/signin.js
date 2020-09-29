import React, { useState, useEffect, useContext } from "react";
import { FaGooglePlusG, FaFacebookF } from "react-icons/fa";
import { FiTwitter } from "react-icons/fi";
import Router from "next/router";
import Authentication from "@components/Layout/Authentication/Authentication";
import Checkbox from "@common/Checkbox/Checkbox";
import PrimaryButton from "@common/PrimaryButton/PrimaryButton";
import AuthInput from "@common/AuthInput/AuthInput";
import Spinner from "@components/Spinner/Spinner";
import AppContext from "@features/context/AppContext";
import { signIn as sIn, getOwner } from "@features/service/Functions/index";
import i18next from "@i18n";
import "../styles/signin.scss";

const { useTranslation } = i18next;

const SignIn = () => {
  const {
    authError,
    authUserError,
    setAuthUserError,
    setOwner,
    setError,
  } = useContext(AppContext);
  const { t } = useTranslation(["component", "signin"]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRembermeChecked, setStatusOfRemberme] = useState(false);
  const [isAuth, setStatusOfAuth] = useState(null);

  const inputPassword = t("common:input.password");
  const description = t("signin:description");
  const remindPassword = t("signin:forget");
  const buttonText = t("signin:button");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRembermeChecked) {
      localStorage.email = email;
      localStorage.password = password;
    }
    sIn({ email, password, setAuthUserError, Router, setError });
  };

  useEffect(() => {
    if (localStorage.email && localStorage.password) {
      setEmail(localStorage.email);
      setPassword(localStorage.password);
    }

    getOwner({ setStatusOfAuth, setOwner });
  }, []);

  if (isAuth == null) return <Spinner />;
  else if (isAuth) {
    Router.push("/");
    return <Spinner />;
  }
  return (
    <Authentication type="signin">
      <>
        <div className="authentication__form__wrapper__icons">
          <div className="authentication__form__wrapper__icons__icon">
            <a
              href="/auth/google"
              className="authentication__form__wrapper__icons__icon__link"
            >
              <FaGooglePlusG />
            </a>
          </div>
          <div className="authentication__form__wrapper__icons__icon">
            <a
              href="/auth/twitter"
              className="authentication__form__wrapper__icons__icon__link"
            >
              <FiTwitter />
            </a>
          </div>
          <div className="authentication__form__wrapper__icons__icon">
            <a
              href="/auth/facebook"
              className="authentication__form__wrapper__icons__icon__link"
            >
              <FaFacebookF />
            </a>
          </div>
        </div>
        <p className="authentication__form__wrapper__text">{description}</p>
        <div className="authentication__form__wrapper__inputs">
          <form
            className="authentication__form__wrapper__inputs__wrapper"
            onSubmit={handleSubmit}
          >
            {authUserError && (
              <p className="input-error">
                {t(`signin:error.${authUserError}`)}
              </p>
            )}
            <div className="authentication__form__wrapper__inputs__wrapper__input__signin">
              <AuthInput
                value={email}
                onChange={setEmail}
                title="E-mail"
                size="x-large"
              />
            </div>
            <div className="authentication__form__wrapper__inputs__wrapper__input__signin">
              <AuthInput
                type="password"
                value={password}
                onChange={setPassword}
                title={inputPassword}
                size="x-large"
              />
            </div>

            <div className="authentication__form__wrapper__inputs__wrapper__helpers">
              <div className="authentication__form__wrapper__inputs__wrapper__helpers__rember-me">
                <Checkbox
                  value={isRembermeChecked}
                  onChange={setStatusOfRemberme}
                />
              </div>

              <span className="authentication__form__wrapper__inputs__wrapper__helpers__rember-me__text">
                {remindPassword}
              </span>
            </div>
            <div className="authentication__form__wrapper__inputs__wrapper__button">
              <PrimaryButton value={buttonText} size="large" />
            </div>
            {authError && (
              <div className="authentication__form__wrapper__inputs__wrapper__error">
                <p className="input-error">
                  {t(`component:layout.authentication.error.${authError}`)}
                </p>
              </div>
            )}
          </form>
        </div>
      </>
    </Authentication>
  );
};

export default SignIn;

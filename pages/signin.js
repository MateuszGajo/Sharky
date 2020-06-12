import React, { useState, useEffect, useContext } from "react";
import { FaGooglePlusG, FaFacebookF } from "react-icons/fa";
import { FiTwitter } from "react-icons/fi";
import Authentication from "../features/components/Layout/Authentication/Authentication";
import Checkbox from "../features/common/Checkbox/Checkbox";
import PrimaryButton from "../features/common/PrimaryButton/PrimaryButton";
import AuthInput from "../features/common/AuthInput/AuthInput";
import axios from "axios";
import CacheAxios from "../features/CachceAxios/CacheAxios";
import { GlobalContext } from "../features/contex/globalContext";
import i18next from "../i18n";
const { useTranslation } = i18next;
import "../styles/main.scss";
import Router from "next/router";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRembermeChecked, setStatusOfRemberme] = useState(false);

  const { authError, authUserError, setAuthError, signIn: sIn } = useContext(
    GlobalContext
  );
  const { t } = useTranslation(["component", "signin"]);

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
    sIn(email, password);
  };

  useEffect(() => {
    if (localStorage.email && localStorage.password) {
      setEmail(localStorage.email);
      setPassword(localStorage.password);
    }

    axios
      .get("/auth/me")
      .then(({ data: { verify } }) => {
        console.log(verify);
        if (verify) {
          // Router.push("/");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <Authentication type="signin">
      <>
        <div className="authentication__form__wrapper__icons">
          <div className="authentication__form__wrapper__icons__icon">
            <a
              href="/auth/google"
              className="authentication__form__wrapper__icons__icon--link"
            >
              <FaGooglePlusG />
            </a>
          </div>
          <div className="authentication__form__wrapper__icons__icon">
            <a
              href="/auth/twitter"
              className="authentication__form__wrapper__icons__icon--link"
            >
              <FiTwitter />
            </a>
          </div>
          <div className="authentication__form__wrapper__icons__icon">
            <a
              href="/auth/facebook"
              className="authentication__form__wrapper__icons__icon--link"
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
            {authUserError && <p className="input-error">{authUserError}</p>}
            <div className="authentication__form__wrapper__inputs__wrapper__input--signin">
              <AuthInput
                value={email}
                onChange={setEmail}
                title="E-mail"
                size="x-large"
              />
            </div>
            <div className="authentication__form__wrapper__inputs__wrapper__input--signin">
              <AuthInput
                type="password"
                value={password}
                onChange={setPassword}
                title={inputPassword}
                size="x-large"
              />
            </div>

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
            {authError && (
              <div className="authentication__form__wrapper__inputs__wrapper__error">
                <p className="input-error">{authError}</p>
              </div>
            )}
          </form>
        </div>
      </>
    </Authentication>
  );
};

export default SignIn;

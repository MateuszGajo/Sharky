import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Authentication from "../features/components/Layout/Authentication/Authentication";
import { FaGooglePlusG, FaFacebookF } from "react-icons/fa";
import { FiTwitter } from "react-icons/fi";
import useTranslation from "next-translate/useTranslation";
import Checkbox from "../features/common/Checkbox/Checkbox";
import PrimaryButton from "../features/common/PrimaryButton/PrimaryButton";
import AuthInput from "../features/common/AuthInput/AuthInput";
import { GlobalContext } from "../features/contex/globalContext";
import "../styles/main.scss";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRembermeChecked, setStatusOfRemberme] = useState(false);

  const { authError, authUserError, signIn: sIn } = useContext(GlobalContext);
  console.log(authError, authUserError);
  const { t } = useTranslation();

  const inputPassword = t("common:input.password");
  const description = t("signin:description");
  const remindPassword = t("signin:forget");
  const buttonText = t("signin:button");

  const handleSubmit = (e) => {
    e.preventDefault();
    sIn(email, password);
  };

  useEffect(() => {
    console.log(t(`component:layout.authentication.error.server-error`));
    // axios
    //   .get("/auth/me")
    //   .then((resp) => console.log(resp))
    //   .catch((err) => console.log(err));
    // Axios.get("/auth/error")
    //   .then((resp) => {
    //     const { data } = resp || null;
    //     if (data) {
    //       setAuthError(t(`signin:error.${data}`));
    //     }
    //   })
    //   .catch((err) => {
    //     setAuthError("server-error");
    //   });
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

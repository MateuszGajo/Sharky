import React, { useState, useReducer } from "react";
import axios from "axios";
import Router from "next/router";
import { GlobalContext } from "../features/contex/globalContext";
import { signUpValidation } from "../features/Validation/Validation";
import AuthReducer from "../features/contex/authReducer";
import { authInitState } from "../features/contex/initState";
import i18next from "../i18n";
const { useTranslation } = i18next;

const MyApp = ({ Component, pageProps }) => {
  const { t } = useTranslation(["component", "signin", "signup"]);
  const [authError, setAuthError] = useState("");
  const [authUserError, setAuthUserError] = useState("");
  const [validationSignUpError, setValidationSignUpError] = useState("");

  const [state, dispatch] = useReducer(AuthReducer, authInitState);

  const signUp = (creds) => {
    if (signUpValidation(creds, dispatch)) {
      setValidationSignUpError("");
      axios
        .post("/auth/signup", {
          creds,
        })
        .then(({ data: { userExist, error } }) => {
          if (!userExist && !error) {
            setAuthError("");
            setAuthUserError("");
            Router.push("/");
          }
          userExist && setAuthUserError(t(`signup:error.${userExist}`));
          error &&
            setAuthError(t(`component:layout.authentication.error.${error}`));
        })
        .catch((err) => {
          setAuthError(t(`component:layout.authentication.error.server-error`));
        });
    } else setValidationSignUpError(t(`signup:validation-errors.fields-error`));
  };

  const signIn = ({ email, password }) => {
    axios
      .post("/auth/signin", {
        email,
        password,
      })
      .then((resp) => {
        const { error, userNotExist } = resp.data;
        if (!error && !userNotExist) {
          setAuthError("");
          setAuthUserError("");
          Router.push("/");
        }
        error &&
          setAuthError(t(`component:layout.authentication.error.${error}`));
        userNotExist && setAuthUserError(t(`signin:error.${userNotExist}`));
      })
      .catch((err) => {
        setAuthError(t(`component:layout.authentication.error.server-error`));
      });
  };
  return (
    <GlobalContext.Provider
      value={{
        authError,
        setAuthError,
        authUserError,
        signIn,
        signUp,
        validationSignUpError,
        ...state,
      }}
    >
      <Component {...pageProps} />
    </GlobalContext.Provider>
  );
};

export default MyApp;

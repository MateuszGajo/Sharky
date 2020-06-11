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
  const { t } = useTranslation(["component", "signin"]);
  const [authError, setAuthError] = useState("");
  const [authUserError, setAuthUserError] = useState("");

  const [state, dispatch] = useReducer(AuthReducer, authInitState);

  const signUp = (creds) => {
    if (signUpValidation(creds, dispatch)) {
    }
  };

  const signIn = ({ email, password }) => {
    axios
      .post("/auth/signin", {
        email,
        password,
      })
      .then((resp) => {
        const { error, userNotExist } = resp.data;
        if (!error && !userNotExist) Router.push("/");
        error &&
          setAuthError(t(`component:layout.authentication.error.${error}`));
        userNotExist &&
          setUserError(
            t(`signin:error.layout.authentication.error.${userNotExist}`)
          );
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
        ...state,
      }}
    >
      <Component {...pageProps} />
    </GlobalContext.Provider>
  );
};

export default MyApp;

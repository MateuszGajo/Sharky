import React, { useState, useReducer } from "react";
import axios from "axios";
import useTranslation from "next-translate/useTranslation";
import Router from "next/router";
import { GlobalContext } from "../features/contex/globalContext";
import { signUpValidation } from "../features/Validation/Validation";
import AuthReducer from "../features/contex/authReducer";
import { authInitState } from "../features/contex/initState";

const MyApp = ({ Component, pageProps }) => {
  const { t } = useTranslation();
  const [authError, setAuthError] = useState("");
  const [authUserError, setAuthUserError] = useState("");

  const [state, dispatch] = useReducer(AuthReducer, authInitState);
  console.log(state);

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
        console.log(err);
        setAuthError(t(`component:layout.authentication.error.server-error`));
      });
  };
  return (
    <GlobalContext.Provider
      value={{
        authError,
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

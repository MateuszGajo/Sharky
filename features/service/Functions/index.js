import Router from "next/router";
import axios from "~features/service/Axios";
import { signUpValidation } from "~features/Validation/Validation";
import countryCode from "~root/utils/countryCode";
import i18next from "~i18n";

const { i18n } = i18next;

export const getOwner = ({ setStatusOfAuth, setOwner }) => {
  axios
    .get("/user/me")
    .then(({ data: { user } }) => {
      setOwner(user);
      setStatusOfAuth(true);
    })
    .catch(({ response: { status } }) => {
      if (status === 401) setStatusOfAuth(false);
    });
};

export const signUp = ({
  creds,
  dispatch,
  setValidationSignUpError,
  setError,
}) => {
  if (signUpValidation(creds, dispatch)) {
    setValidationSignUpError("");
    axios
      .post("/auth/signup", {
        creds,
      })
      .then(() => {
        Router.push("/home");
      })
      .catch(({ response: { data: message, status } }) => {
        if (status === 403) {
          dispatch({ type: "EMAIL_ERROR", msg: "email-in-use" });
          setValidationSignUpError("fields-error");
        }
        setError(message);
      });
  } else setValidationSignUpError("fields-error");
};

export const signIn = ({ email, password, setAuthUserError, setError }) => {
  axios
    .post("/auth/signin", {
      email,
      password,
    })
    .then(() => Router.push("/home"))
    .catch(({ response: { status, data: message } }) => {
      if (status === 400) setError(message);
      else if (status === 401) setAuthUserError(message);
    });
};

export const checkLanguage = () => {
  axios
    .get("/user/get/language")
    .then(({ data: { language } }) => {
      const code = countryCode(language);
      if (i18n.language !== code) {
        i18n.changeLanguage(code);
      }
    })
    .catch(() => {});
};

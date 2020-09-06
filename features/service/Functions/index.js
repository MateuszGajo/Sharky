import axios from "axios";
import { signUpValidation } from "@features/Validation/Validation";

export const getOwner = ({ setStatusOfAuth, setOwner }) => {
  axios
    .get("/user/me")
    .then(({ data: { user } }) => {
      setOwner(user);
      setStatusOfAuth(true);
    })
    .catch(({ response: { status } }) => {
      if (status == 401) setStatusOfAuth(false);
    });
};

export const signUp = ({
  creds,
  dispatch,
  setValidationSignUpError,
  setError,
  Router,
}) => {
  if (signUpValidation(creds, dispatch)) {
    setValidationSignUpError("");
    axios
      .post("/auth/signup", {
        creds,
      })
      .then(() => {
        Router.push("/");
      })
      .catch(({ response: { data: message, status } }) => {
        if (status == 403) {
          dispatch({ type: "EMAIL_ERROR", msg: "email-in-use" });
          setValidationSignUpError("fields-error");
        }
        setError(message);
      });
  } else setValidationSignUpError("fields-error");
};

export const signIn = ({
  email,
  password,
  setAuthUserError,
  setError,
  Router,
}) => {
  axios
    .post("/auth/signin", {
      email,
      password,
    })
    .then(() => {
      Router.push("/");
    })
    .catch(({ response: { status, data: message } }) => {
      if (status == 400) setError(message);
      else if (status == 401) setAuthUserError(message);
    });
};

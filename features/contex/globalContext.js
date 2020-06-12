import React from "react";

export const GlobalContext = React.createContext({
  authError: "",
  authUserError: "",
  signUpValidation: {
    authError: "",
    emailError: "",
    passwordError: "",
    confirmPasswordError: "",
    firstNameError: "",
    lastNameError: "",
    phoneNumberError: "",
    isValidationError: false,
  },
  signIn: () => {},
});

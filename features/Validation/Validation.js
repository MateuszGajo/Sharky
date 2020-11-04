export const signUpValidation = (creds, dispatch) => {
  const {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    phone: phoneNumber,
  } = creds;

  let isValid = true;
  let emailErrorMessage = "";
  let passwordErrorMessage = "";
  let confirmPasswordErrorMessage = "";
  let firstNameErrorMessage = "";
  let lastNameErrorMessage = "";
  let phoneNumberErrorMessgae = "";
  const emailRegex = /^([a-zA-Z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
  const numberRegex = /[\d]{9}/;

  if (!email) {
    emailErrorMessage = "email-validation-error";
    isValid = false;
  } else if (!emailRegex.test(email)) {
    emailErrorMessage = "email-validation-error";
    isValid = false;
  }

  if (password.length < 6) {
    passwordErrorMessage = "password-too-short";
    isValid = false;
  }

  if (!confirmPassword) {
    confirmPasswordErrorMessage = "empty-field";
    isValid = false;
  }

  if (password != confirmPassword) {
    confirmPasswordErrorMessage = "passwords-not-equal";
    isValid = false;
  }

  if (!firstName) {
    firstNameErrorMessage = "empty-field";
    isValid = false;
  }

  if (firstName.length > 49) {
    firstNameErrorMessage = "too-long-first-name";
    isValid = false;
  }

  if (!lastName) {
    lastNameErrorMessage = "empty-field";
    isValid = false;
  }

  if (lastName.length > 49) {
    lastNameErrorMessage = "too-long-last-name";
    isValid = false;
  }

  if (!phoneNumber) {
    phoneNumberErrorMessgae = "empty-field";
    isValid = false;
  }

  if (!numberRegex.test(phoneNumber)) {
    phoneNumberErrorMessgae = "invalid-phone-number";
    isValid = false;
  }

  dispatch({ type: "EMAIL_ERROR", msg: emailErrorMessage });
  dispatch({ type: "PASSWORD_ERROR", msg: passwordErrorMessage });
  dispatch({
    type: "CONFIRM_PASSWORD_ERROR",
    msg: confirmPasswordErrorMessage,
  });
  dispatch({ type: "FIRST_NAME_ERROR", msg: firstNameErrorMessage });
  dispatch({ type: "LAST_NAME_ERROR", msg: lastNameErrorMessage });
  dispatch({ type: "PHONE_NUMBER_ERROR", msg: phoneNumberErrorMessgae });

  return isValid;
};

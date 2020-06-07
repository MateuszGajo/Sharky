export const signUpValidation = (creds, dispatch) => {
  const {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    phone,
  } = creds;

  let isValid = true;
  const emailRegex = /^([a-zA-Z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
  const numberRegex = /[\d]{9}/;

  if (!email) {
    dispatch({ type: "EMAIL_ERROR", msg: "empty-field" });
    isValid = false;
  } else if (!emailRegex.test(email)) {
    dispatch({ type: "EMAIL_ERROR", msg: "email-validation-error" });
    isValid = false;
  }

  if (!password) {
    dispatch({ type: "PASSWORD_ERORR", msg: "empty-field" });
    isValid = false;
  }

  if (!confirmPassword) {
    dispatch({
      type: "CONFIRM_PASSWORD_ERROR",
      msg: "empty-field",
    });
    isValid = false;
  }

  if (password != confirmPassword) {
    dispatch({
      type: "CONFIRM_PASSWORD_ERROR",
      msg: "passwords-not-equal-error",
    });
    isValid = false;
  }

  if (!firstName) {
    dispatch({ type: "FIRST_NAME_ERROR", msg: "empty-field" });
    isValid = false;
  }

  if (firstName.length > 49) {
    dispatch({ type: "FIRST_NAME_ERROR", msg: "too-long-first-name" });
    isValid = false;
  }

  if (!lastName) {
    dispatch({ type: "LAST_NAME_ERROR", msg: "empty-field" });
    isValid = false;
  }

  if (lastName.length > 49) {
    dispatch({ type: "LAST_NAME_ERROR", msg: "too-long-last-name" });
    isValid = false;
  }

  if (!phone) {
    dispatch({ type: "PHONE_NUMBER_ERROR", msg: "empty-field" });
    isValid = false;
  }

  if (!numberRegex.test(phone)) {
    dispatch({ type: "PHONE_NUMBER_ERROR", msg: "invalid-phone-number" });
    isValid = false;
  }

  return isValid;
};

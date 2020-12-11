export default (state, action) => {
  switch (action.type) {
    case "EMAIL_ERROR":
      return {
        ...state,
        signUpValidation: {
          ...state.signUpValidation,
          emailError: action.msg,
        },
      };

    case "PASSWORD_ERROR":
      return {
        ...state,
        signUpValidation: {
          ...state.signUpValidation,
          passwordError: action.msg,
        },
      };

    case "CONFIRM_PASSWORD_ERROR":
      return {
        ...state,
        signUpValidation: {
          ...state.signUpValidation,
          confirmPasswordError: action.msg,
        },
      };

    case "FIRST_NAME_ERROR":
      return {
        ...state,
        signUpValidation: {
          ...state.signUpValidation,
          firstNameError: action.msg,
        },
      };

    case "LAST_NAME_ERROR":
      return {
        ...state,
        signUpValidation: {
          ...state.signUpValidation,
          lastNameError: action.msg,
        },
      };

    case "PHONE_NUMBER_ERROR":
      return {
        ...state,
        signUpValidation: {
          ...state.signUpValidation,
          phoneNumberError: action.msg,
        },
      };
    default:
      return {
        ...state,
      };
  }
};

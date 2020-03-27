import React from "react";

export const WizzardContext = React.createContext({
  numberOfPages: 0,
  setNumberOfPages: () => {},
  page: 1,
  setPage: () => {},
  email: "",
  setEmail: () => {},
  password: "",
  setPassword: () => {},
  confirmPassword: "",
  setConfirmPassword: () => {},
  firstName: "",
  setFirstName: () => {},
  lastName: "",
  setLastName: () => {},
  phoneNumber: "",
  setPhoneNumber: () => {}
});

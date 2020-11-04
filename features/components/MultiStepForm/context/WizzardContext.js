import React from "react";
import PropTypes from "prop-types"

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

WizzardContext.Provider.propTypes = {
  value: PropTypes.shape({
    numberOfPages: PropTypes.number,
    setNumberOfPages: PropTypes.func,
    page: PropTypes.number,
    setPage: PropTypes.func,
    email: PropTypes.string,
    setEmail: PropTypes.func,
    password: PropTypes.string,
    setPassword: PropTypes.func,
    confirmPassword: PropTypes.string,
    setConfirmPassword: PropTypes.func,
    firstName: PropTypes.string,
    setFirstName: PropTypes.func,
    lastName: PropTypes.string,
    setLastName: PropTypes.func,
    phoneNumber: PropTypes.string,
    setPhoneNumber: PropTypes.func
  })
}


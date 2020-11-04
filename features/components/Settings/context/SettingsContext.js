import React from "react";
import PropTypes from "prop-types";

const settingsContext = React.createContext({
  name: "",
  setName: () => {},
  type: "",
  setType: () => {},
  title: "",
  setTitle: () => {},
  userPassword: "",
  setUserPassword: () => {},
  isOpenConfirmPopUp: false,
  setOpenConfirmPopUp: () => {},
  confirmPopUpError: "",
  setConfirmPopUpError: () => {},
});

settingsContext.propTypes = {
  name: PropTypes.string,
  setName: PropTypes.func,
  type: PropTypes.string,
  setType: PropTypes.func,
  title: PropTypes.string,
  setTitle: PropTypes.func,
  userPassword: PropTypes.string,
  setUserPassword: PropTypes.func,
  isOpenConfirmPopUp: PropTypes.bool,
  setOpenConfirmPopUp: PropTypes.func,
  confirmPopUpError: PropTypes.string,
  setConfirmPopUpError: PropTypes.func,
};

export default settingsContext;

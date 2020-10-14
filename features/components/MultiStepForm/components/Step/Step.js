import React, { useContext } from "react";
import PropTypes from "prop-types";
import { WizzardContext } from "../../context/WizzardContext";

const Step = ({ children, pageIndex }) => {
  const { page } = useContext(WizzardContext);

  return pageIndex === page ? children : null;
};

Step.propTypes = {
  children: PropTypes.element,
  pageIndex: PropTypes.number
}

export default Step;

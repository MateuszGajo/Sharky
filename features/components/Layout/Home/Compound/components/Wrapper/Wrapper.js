import React from "react";
import PropTypes from "prop-types";

const Wrapper = ({ children }) => {
  return <section className="home">{children}</section>;
};

Wrapper.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element)
}

export default Wrapper;

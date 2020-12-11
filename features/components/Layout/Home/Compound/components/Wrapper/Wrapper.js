import React from "react";
import PropTypes from "prop-types";

const Wrapper = ({ children }) => (
  <section className="home">{children}</section>
);
Wrapper.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
};

export default Wrapper;

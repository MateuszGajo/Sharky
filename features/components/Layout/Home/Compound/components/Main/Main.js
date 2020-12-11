import React from "react";
import PropTypes from "prop-types";

const Main = ({ children }) => (
  <div className="home__main">
    <div data-testid="main-content" className="home__main__content">
      {children}
    </div>
  </div>
);

Main.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

export default Main;

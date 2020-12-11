import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { GiHamburgerMenu } from "react-icons/gi";

const Hamburger = ({ setStatusOfNav }) => {
  const hamburgerMenu = useRef(null);

  const setStatusOfNavbar = () => {
    setStatusOfNav(true);
  };

  useEffect(() => {
    hamburgerMenu.current?.addEventListener("click", setStatusOfNavbar);
    return () => {
      hamburgerMenu.current.removeEventListener("click", setStatusOfNavbar);
    };
  }, []);

  return (
    <div className="home__hamburger__container" ref={hamburgerMenu}>
      <div className="home__hamburger__container__icon">
        <GiHamburgerMenu />
      </div>
    </div>
  );
};

Hamburger.propTypes = {
  setStatusOfNav: PropTypes.func.isRequired,
};

export default Hamburger;

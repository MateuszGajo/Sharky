import React, { useRef, useContext, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

const Hamburger = ({ setStatusOfNav }) => {
  const hamburgerMenu = useRef(null);

  const setStatusOfNavbar = () => {
    setStatusOfNav(true);
  };

  useEffect(() => {
    hamburgerMenu.current?.addEventListener("click", setStatusOfNavbar);
    return () => {
      removeEventListener("click", setStatusOfNavbar);
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

export default Hamburger;

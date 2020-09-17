import React, { useRef, useContext, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { WizzardContext } from "../../../../context/WizzardContext";

const Hamburger = () => {
  const hamburgerMenu = useRef(null);

  const { setStatusOfNav } = useContext(WizzardContext);

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

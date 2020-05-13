import React, { useRef, useContext, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { WizzardContext } from "../../context/WizzardContext";

const Wrapper = ({ children }) => {
  const hamburgerMenu = useRef(null);

  const { setStatusOfNav } = useContext(WizzardContext);

  useEffect(() => {
    hamburgerMenu.current?.addEventListener("click", () => {
      setStatusOfNav(true);
    });
  }, []);
  return (
    <section className="home">
      {console.log(hamburgerMenu)}
      <div className="home__hamburger" ref={hamburgerMenu}>
        <div className="home__hamburger__icon">
          <GiHamburgerMenu />
        </div>
      </div>
      {children}
    </section>
  );
};

export default Wrapper;

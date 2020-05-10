import React, { useState } from "react";
import Navbar from "../features/components/Layout/Home/Compound/components/NavBar/Navbar";
import About from "../features/components/group/About/About";
import Members from "../features/components/group/Members/Members";
import Home from "../features/components/group/Home/Home";

const Group = () => {
  const [section, setSection] = useState("");

  const renderComponent = (name) => {
    switch (name) {
      case "home":
        return <Home />;
      case "members":
        return <Members />;
      case "about":
        return <About />;
      default:
        return <Home />;
    }
  };

  return (
    <section className="group">
      <Navbar />
      <div className="group__container">
        <div className="group__container__content">
          {renderComponent(section)}
        </div>
        <div className="group__container__side-bar">
          <div className="group__container__side-bar__title">
            <h3 className="group__container__side-bar__title--h3">
              Nowości w zamościu
            </h3>
          </div>
          <div
            className="group__container__side-bar__item"
            onClick={() => setSection("home")}
          >
            <span className="group__container__side-bar__item--span">
              Przeglądaj
            </span>
          </div>
          <div
            className="group__container__side-bar__item"
            onClick={() => setSection("members")}
          >
            <span className="group__container__side-bar__item--span">
              Członkowie
            </span>
          </div>
          <div
            className="group__container__side-bar__item"
            onClick={() => setSection("about")}
          >
            <span className="group__container__side-bar__item--span">
              Informacje
            </span>
          </div>
          <div className="group__container__side-bar__item">
            <span className="group__container__side-bar__item--span">
              Opuść grupe
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Group;

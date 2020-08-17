import React from "react";
import { FiLock } from "react-icons/fi";
import About from "./components/About/About";
import Members from "./components/Members/Members";
import Home from "./components/Home/Home";

const Content = ({
  section,
  idGroup,
  role,
  idMember,
  setNumberOfMembers,
  numberOfMembers,
  groupName,
  creationDate,
}) => {
  const renderComponent = (name) => {
    switch (name) {
      case "home":
        return <Home idGroup={idGroup} />;
      case "members":
        return (
          <Members
            idGroup={idGroup}
            role={role}
            idMember={idMember}
            setNumberOfMembers={setNumberOfMembers}
            numberOfMembers={numberOfMembers}
          />
        );
      case "about":
        return (
          <About
            name={groupName}
            numberOfMembers={numberOfMembers}
            creationDate={creationDate}
          />
        );
      default:
        return <Home idGroup={idGroup} />;
    }
  };
  return (
    <div className="group__container__content">
      {idMember ? (
        renderComponent(section)
      ) : (
        <p className="group__container__content__text">
          <span className="group__container__content__text__icon">
            <FiLock />
          </span>
          Nie jesteś członkiem grupy
        </p>
      )}
    </div>
  );
};

export default Content;

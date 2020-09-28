import React from "react";
import { FiLock } from "react-icons/fi";
import About from "./components/About/About";
import Members from "./components/Members/Members";
import Home from "./components/Home/Home";

const Content = ({
  section,
  groupId,
  role,
  memberId,
  setNumberOfMembers,
  numberOfMembers,
  groupName,
  startingDate,
}) => {
  const renderComponent = (name) => {
    switch (name) {
      case "home":
        return <Home groupId={groupId} />;
      case "members":
        return (
          <Members
            groupId={groupId}
            role={role}
            memberId={memberId}
            setNumberOfMembers={setNumberOfMembers}
            numberOfMembers={numberOfMembers}
          />
        );
      case "about":
        return (
          <About
            name={groupName}
            numberOfMembers={numberOfMembers}
            startingDate={startingDate}
          />
        );
      default:
        return <Home groupId={groupId} />;
    }
  };
  return (
    <div className="group__container__content">
      {memberId ? (
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

import React from "react";
import PropTypes from "prop-types";
import { FiLock } from "react-icons/fi";
import About from "./components/About/About";
import Members from "./components/Members/Members";
import Home from "./components/Home/Home";
import i18next from "@i18n";

const {useTranslation} = i18next;

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
  const {t} = useTranslation(["group"]);

  const noPermission = t("group:content.no-permission");
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
          {noPermission}
        </p>
      )}
    </div>
  );
};

Content.propTypes= {
  section: PropTypes.string,
  groupId: PropTypes.number,
  role: PropTypes.string,
  memberId: PropTypes.number,
  setNumberOfMembers: PropTypes.func,
  numberOfMembers: PropTypes.number,
  groupName: PropTypes.string,
  startingDate: PropTypes.string
}

export default Content;

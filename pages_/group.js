import React, { useState } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import useTranslation from "next-translate/useTranslation";
import cx from "classnames";
import Navbar from "../features/components/Layout/Home/Compound/components/NavBar/Navbar";
import About from "../features/components/group/About/About";
import Members from "../features/components/group/Members/Members";
import Home from "../features/components/group/Home/Home";
import InvitePerson from "../features/common/PopUp/InvitePerson/InvitePerson";
import "../styles/main.scss";

const Group = () => {
  const [section, setSection] = useState("home");
  const [isPopupOpen, setStatusOfPopup] = useState(false);

  const { t } = useTranslation();

  const homeName = t("group:side-bar.home");
  const membersName = t("group:side-bar.members");
  const aboutName = t("group:side-bar.about");
  const inviteText = t("group:side-bar.invite");
  const leaveText = t("group:side-bar.leave");

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
      <InvitePerson isOpen={isPopupOpen} setStatusOfOpen={setStatusOfPopup} />
      <Navbar />
      <div className="group__container">
        <div className="group__container__content">
          {renderComponent(section)}
        </div>
        <div className="group__container__side-bar">
          <div className="group__container__side-bar--fixed">
            <div className="group__container__side-bar__title">
              <h3 className="group__container__side-bar__title--h3">
                Nowości w zamościu
              </h3>
            </div>
            <div className="group__container__side-bar__navigation">
              <div
                className={cx("group__container__side-bar__navigation__item", {
                  "group__container__side-bar__navigation__item--active":
                    section === "home",
                })}
                onClick={() => setSection("home")}
              >
                <span className="group__container__side-bar__navigation__item--span">
                  {homeName}
                </span>
              </div>
              <div
                className={cx("group__container__side-bar__navigation__item", {
                  "group__container__side-bar__navigation__item--active":
                    section === "members",
                })}
                onClick={() => setSection("members")}
              >
                <span className="group__container__side-bar__navigation__item--span">
                  {membersName}
                </span>
              </div>
              <div
                className={cx("group__container__side-bar__navigation__item", {
                  "group__container__side-bar__navigation__item--active":
                    section === "about",
                })}
                onClick={() => setSection("about")}
              >
                <span className="group__container__side-bar__navigation__item--span">
                  {aboutName}
                </span>
              </div>
            </div>
            <div className="group__container__side-bar__manage">
              <div className="group__container__side-bar__manage__item">
                <span className="group__container__side-bar__item--span">
                  {leaveText}
                </span>
                <div className="group__container__side-bar__manage__item__icon group__container__side-bar__manage__item__icon--leave">
                  <AiOutlineMinus />
                </div>
              </div>
              <div
                className="group__container__side-bar__manage__item"
                onClick={() => setStatusOfPopup(true)}
              >
                <span className="group__container__side-bar__item--span">
                  {inviteText}
                </span>
                <div className="group__container__side-bar__manage__item__icon group__container__side-bar__manage__item__icon--invite">
                  <AiOutlinePlus />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Group;

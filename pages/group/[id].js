import React, { useState, useEffect, useContext } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import cx from "classnames";
import axios from "axios";
import { useRouter } from "next/router";
import { FiLock } from "react-icons/fi";
import Navbar from "@components/Layout/Home/Compound/components/NavBar/Navbar";
import About from "@components/group/About/About";
import Members from "@components/group/Members/Members";
import Home from "@components/group/Home/Home";
import InvitePerson from "@common/PopUp/InvitePerson/InvitePerson";
import Spinner from "@components/Spinner/Spinner";
import AppContext from "@features/context/AppContext";
import i18next from "@i18n";
import "../../styles/main.scss";
const { useTranslation } = i18next;
const Group = () => {
  const { t } = useTranslation(["group", "component"]);

  const router = useRouter();
  const idGroup = router.query.id;

  const { setError } = useContext(AppContext);
  const [section, setSection] = useState("home");
  const [isPopupOpen, setStatusOfPopup] = useState(false);
  const [idMember, setIdMember] = useState(null);
  const [name, setName] = useState("");
  const [isLoading, setStatusOfLoading] = useState(true);
  const [groupInfo, setGroupInfo] = useState({
    name: "",
    numberOfMember: null,
    date: null,
  });

  const homeName = t("group:side-bar.home");
  const membersName = t("group:side-bar.members");
  const aboutName = t("group:side-bar.about");
  const inviteText = t("group:side-bar.invite");
  const leaveText = t("group:side-bar.leave");
  const joinText = t("component:lists.groups.button-join");

  const renderComponent = (name) => {
    switch (name) {
      case "home":
        return <Home idGroup={idGroup} />;
      case "members":
        return <Members idGroup={idGroup} />;
      case "about":
        return <About groupInfo={groupInfo} />;
      default:
        return <Home idGroup={idGroup} />;
    }
  };

  const leaveGroup = () => {
    axios
      .post("/group/leave", { idMember })
      .then(() => {})
      .catch(({ data: { message } }) => setError(message));
  };

  const getGroupInfo = () => {
    axios.post("/group/about", { idGroup }).then(({ data: { groupInfo } }) => {
      setGroupInfo(groupInfo);
    });
  };

  useEffect(() => {
    idGroup &&
      axios
        .post("/group/enter", { idGroup })
        .then(({ data: { idMember, name } }) => {
          console.log(name);
          if (idMember) getGroupInfo();
          setIdMember(idMember);
          setName(name);
          setStatusOfLoading(false);
        });
  }, [idGroup]);
  if (isLoading) return <Spinner />;

  return (
    <section className="group">
      <InvitePerson isOpen={isPopupOpen} setStatusOfOpen={setStatusOfPopup} />
      <Navbar />
      <div className="group__container">
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

        <div className="group__container__side-bar">
          <div className="group__container__side-bar--fixed">
            <div className="group__container__side-bar__title">
              <h3 className="group__container__side-bar__title--h3">
                {!idMember ? name : groupInfo.name}
              </h3>
            </div>
            {idMember ? (
              <>
                <div className="group__container__side-bar__navigation">
                  <div
                    className={cx(
                      "group__container__side-bar__navigation__item",
                      {
                        "group__container__side-bar__navigation__item--active":
                          section === "home",
                      }
                    )}
                    onClick={() => setSection("home")}
                  >
                    <span className="group__container__side-bar__navigation__item--span">
                      {homeName}
                    </span>
                  </div>
                  <div
                    className={cx(
                      "group__container__side-bar__navigation__item",
                      {
                        "group__container__side-bar__navigation__item--active":
                          section === "members",
                      }
                    )}
                    onClick={() => setSection("members")}
                  >
                    <span className="group__container__side-bar__navigation__item--span">
                      {membersName}
                    </span>
                  </div>
                  <div
                    className={cx(
                      "group__container__side-bar__navigation__item",
                      {
                        "group__container__side-bar__navigation__item--active":
                          section === "about",
                      }
                    )}
                    onClick={() => setSection("about")}
                  >
                    <span className="group__container__side-bar__navigation__item--span">
                      {aboutName}
                    </span>
                  </div>
                </div>
                <div className="group__container__side-bar__manage">
                  <div
                    className="group__container__side-bar__manage__item"
                    onClick={() => leaveGroup()}
                  >
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
              </>
            ) : (
              <div className="group__container__side-bar__manage">
                <div
                  className="group__container__side-bar__manage__item"
                  onClick={() => setStatusOfPopup(true)}
                >
                  <span className="group__container__side-bar__item--span">
                    {joinText}
                  </span>
                  <div className="group__container__side-bar__manage__item__icon group__container__side-bar__manage__item__icon--invite">
                    <AiOutlinePlus />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Group;

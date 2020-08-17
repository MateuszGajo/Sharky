import React, { useContext } from "react";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineDelete } from "react-icons/ai";
import cx from "classnames";
import { useRouter } from "next/router";
import axios from "axios";
import i18next from "@i18n";
import AppContext from "@features/context/AppContext";

const { useTranslation } = i18next;

const SideBar = ({
  setSection,
  setStatusOfPopUp,
  groupName,
  idMember,
  setIdMember,
  setRole,
  section,
  role,
  idGroup,
}) => {
  const { t } = useTranslation(["group", "component"]);
  const router = useRouter();

  const { setError } = useContext(AppContext);

  const homeName = t("group:side-bar.home");
  const membersName = t("group:side-bar.members");
  const aboutName = t("group:side-bar.about");
  const inviteText = t("group:side-bar.invite");
  const leaveText = t("group:side-bar.leave");
  const joinText = t("component:lists.groups.button-join");
  const deleteGroupText = t("group:side-bar.delete");

  const joinGroup = () => {
    axios
      .post("/group/user/add", { idGroup })
      .then(({ data: { id } }) => {
        setIdMember(id);
        setRole("member");
      })
      .catch(({ response: { data: message } }) => setError(message));
  };

  const leaveGroup = () => {
    axios
      .post("/group/leave", { idMember, idGroup, role })
      .then(() => {
        setIdMember(null);
      })
      .catch(({ response: { data: message } }) => setError(message));
  };

  const deleteGroup = () => {
    axios
      .post("/group/delete", { idGroup })
      .then(() => {
        router.push("/");
      })
      .catch(({ response: { data: message } }) => setError(message));
  };
  return (
    <div className="group__container__side-bar">
      <div className="group__container__side-bar--fixed">
        <div className="group__container__side-bar__title">
          <h3 className="group__container__side-bar__title--h3">{groupName}</h3>
        </div>
        {idMember ? (
          <>
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
                onClick={() => setStatusOfPopUp(true)}
              >
                <span className="group__container__side-bar__item--span">
                  {inviteText}
                </span>
                <div className="group__container__side-bar__manage__item__icon group__container__side-bar__manage__item__icon--invite">
                  <AiOutlinePlus />
                </div>
              </div>
              {role == "admin" && (
                <div
                  className="group__container__side-bar__manage__item"
                  onClick={deleteGroup}
                >
                  <span className="group__container__side-bar__item--span">
                    {deleteGroupText}
                  </span>
                  <div className="group__container__side-bar__manage__item__icon ">
                    <AiOutlineDelete />
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="group__container__side-bar__manage">
            <div
              className="group__container__side-bar__manage__item"
              onClick={() => joinGroup()}
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
  );
};

export default SideBar;

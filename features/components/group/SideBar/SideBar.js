import React, { useContext } from "react";
import PropTypes from "prop-types";
import {AiOutlineMinus, AiOutlineDelete } from "react-icons/ai";
import {GoPlus} from "react-icons/go"
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
  memberId,
  setIdMember,
  setRole,
  section,
  role,
  groupId,
  photo,
  setPhoto,
}) => {
  const { t } = useTranslation(["group", "component"]);
  const router = useRouter();

  const { setError } = useContext(AppContext);

  const homeName = t("group:side-bar.home");
  const membersName = t("group:side-bar.members");
  const aboutName = t("group:side-bar.about");
  const inviteText = t("group:side-bar.invite");
  const leaveText = t("group:side-bar.leave");
  const joinText = t("component:lists.groups.join");
  const deleteGroupText = t("group:side-bar.delete");
  const changePhotoText = t("group:side-bar.change-photo");

  const joinGroup = () => {
    axios
      .post("/group/user/add", { groupId })
      .then(({ data: { id } }) => {
        setIdMember(id);
        setRole("member");
      })
      .catch(({ response: { data: message } }) => setError(message));
  };

  const leaveGroup = () => {
    axios
      .post("/group/leave", { groupId })
      .then(() => {
        setIdMember(null);
      })
      .catch(({ response: { data: message } }) => setError(message));
  };

  const deleteGroup = () => {
    axios
      .post("/group/delete", { groupId })
      .then(() => {
        router.push("/");
      })
      .catch(({ response: { data: message } }) => setError(message));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file.type != "image/png" && file.type != "image/jpeg") {
      return setError("wrong-file-type");
    }
    if (file.size > 200000) {
      return setError("file-too-large");
    }

    const data = new FormData();
    data.append("file", e.target.files[0]);
    data.set("groupId", groupId);

    axios
      .post("/group/change/photo", data)
      .then(({ data: { fileName } }) => {
        setPhoto(fileName);
      })
      .catch(({ response: { data: message } }) => setError(message));
  };
  return (
    <div className="group__container__side-bar">
      <div className="group__container__side-bar--fixed">
        <div className="group__container__side-bar__group-info">
          <div className="group__container__side-bar__group-info__photo">
            {role== 'admin' && (
              <div className="group__container__side-bar__group-info__photo__overlay">
              <label htmlFor="group-photo-change">
                <div className="group__container__side-bar__group-info__photo--overlay__button">
                  {changePhotoText}
                </div>
              </label>
              <input
                type="file"
                name="file"
                id="group-photo-change"
                onChange={handlePhotoChange}
              />
            </div>
            )}
            <img
              src={`/static/images/${photo}`}
              className="group__container__side-bar__group-info__photo__img"
            />
          </div>
          <div className="group__container__side-bar__group-info__title">
            <h2 className="group__container__side-bar__group-info__title__h2">
              {groupName}
            </h2>
          </div>
        </div>
        {memberId ? (
          <>
            <div className="group__container__side-bar__navigation">
              <div
                className={cx("group__container__side-bar__navigation__item", {
                  "group__container__side-bar__navigation__item--active":
                    section === "home",
                })}
                onClick={() => setSection("home")}
              >
                <span className="group__container__side-bar__navigation__item__span">
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
                <span className="group__container__side-bar__navigation__item__span">
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
                <span className="group__container__side-bar__navigation__item__span">
                  {aboutName}
                </span>
              </div>
            </div>
            <div className="group__container__side-bar__manage">
              <div
                className="group__container__side-bar__manage__item"
                onClick={() => leaveGroup()}
              >
                <span className="group__container__side-bar__item__span">
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
                <span className="group__container__side-bar__item__span">
                  {inviteText}
                </span>
                <div className="group__container__side-bar__manage__item__icon group__container__side-bar__manage__item__icon--invite">
                  <GoPlus />
                </div>
              </div>
              {role == "admin" && (
                <div
                  className="group__container__side-bar__manage__item"
                  onClick={deleteGroup}
                >
                  <span className="group__container__side-bar__item__span">
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
              <span className="group__container__side-bar__item__span">
                {joinText}
              </span>
              <div className="group__container__side-bar__manage__item__icon group__container__side-bar__manage__item__icon--invite">
                <GoPlus />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

SideBar.propTypes= {
  setSection: PropTypes.func,
  setStatusOfPopUp: PropTypes.func,
  groupName: PropTypes.string,
  memberId: PropTypes.number,
  setIdMember: PropTypes.func,
  setRole: PropTypes.func,
  section: PropTypes.string,
  role: PropTypes.string,
  groupId: PropTypes.number.isRequired,
  photo: PropTypes.string,
  setPhoto: PropTypes.func
}

export default SideBar;

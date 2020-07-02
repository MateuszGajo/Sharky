import React, { useEffect, useRef } from "react";
import { BsThreeDots } from "react-icons/bs";
import { IoMdShareAlt } from "react-icons/io";
import i18next from "../../../../../i18n";
import UserSettings from "./components/UserSettings/UserSettings";
import OwnerSettings from "./components/OwnerSettings/OwnerSettings";
const { useTranslation } = i18next;

const NavBar = ({
  date,
  user,
  owner,
  shareUser,
  idUser,
  focusCollapse,
  focusIcon,
  setStatusOfHiddenPost,
  posts,
  setPosts,
  setStatusOfReport,
  setStatusOfEdit,
}) => {
  const { lang } = useTranslation(["component"]);

  const settingRef = useRef(null);

  const dtf = new Intl.DateTimeFormat(lang || "pl", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  const [{ value: da }, , { value: mo }, , { value: ye }] = dtf.formatToParts(
    new Date(date)
  );

  const clickHandle = () => {
    const { current: fCollapse } = focusCollapse;
    if (!fCollapse.classList.contains("is-close"))
      fCollapse.classList.add("is-close");
    window.removeEventListener("click", clickHandle);
  };

  useEffect(() => {
    const { current } = settingRef;
    current.addEventListener("click", () => {
      const collapseItem = current.querySelector(
        ".post__item__navbar__column-end__setting__collapse"
      );
      const { current: fCollapse } = focusCollapse;
      const { current: fIcon } = focusIcon;
      if (fCollapse !== collapseItem && fCollapse !== null) {
        fCollapse.classList.add("is-close");
      }

      if (fIcon !== null && fIcon.classList.contains("is-visible"))
        fIcon.classList.remove("is-visible");

      window.addEventListener("click", clickHandle);
      focusCollapse.current = collapseItem;

      collapseItem.classList.toggle("is-close");
    });
  }, []);

  return (
    <div className="post__item__navbar">
      {shareUser && (
        <div className="post__item__navbar__user">
          <div className="post__item__navbar__user--photo">
            <img
              src={"/static/images/" + shareUser.photo}
              alt="Zdjęcie użytkownika"
              className="post__item__navbar__user--photo--img"
            />
          </div>
          <div className="post__item__navbar__user--name">
            <span
              className="post__item__navbar__user--name--span"
              data-testid="post-username"
            >
              {shareUser.firstName + " " + shareUser.lastName}
            </span>
          </div>
          <div className="post__item__navbar__user--share">
            <IoMdShareAlt />
          </div>
        </div>
      )}
      <div className="post__item__navbar__user">
        <div className="post__item__navbar__user--photo">
          <img
            src={"/static/images/" + user.photo}
            alt="Zdjęcie użytkownika"
            className="post__item__navbar__user--photo--img"
          />
        </div>
        <div className="post__item__navbar__user--name">
          <span
            className="post__item__navbar__user--name--span"
            data-testid="post-username"
          >
            {user.firstName + " " + user.lastName}
          </span>
        </div>
      </div>
      <div className="post__item__navbar__column-end">
        <div className="post__item__navbar__column-end__data">
          <span
            className="post__item__navbar__column-end__data--span"
            data-testid="post-date"
          >
            {da} {mo} {ye}
          </span>
        </div>
        <div
          className="post__item__navbar__column-end__setting"
          data-testid="post-setting-icon"
          ref={settingRef}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="post__item__navbar__column-end__setting--icon">
            <BsThreeDots />
          </div>
          <div
            className="post__item__navbar__column-end__setting__collapse is-close"
            data-testid="post-setting"
          >
            {user.id == owner.id ? (
              <OwnerSettings setStatusOfEdit={setStatusOfEdit} />
            ) : (
              <UserSettings
                posts={posts}
                setPosts={setPosts}
                setStatusOfHiddenPost={setStatusOfHiddenPost}
                setStatusOfReport={setStatusOfReport}
                idUser={idUser}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

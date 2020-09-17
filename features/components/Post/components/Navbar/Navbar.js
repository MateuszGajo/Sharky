import React, { useEffect, useRef, useContext } from "react";
import Router from "next/router";
import { BsThreeDots } from "react-icons/bs";
import { IoMdShareAlt } from "react-icons/io";
import UserSettings from "./components/UserSettings/UserSettings";
import OwnerSettings from "./components/OwnerSettings/OwnerSettings";
import PostContext from "../../context/PostContext";
import AppContext from "@features/context/AppContext";
import i18next from "@i18n";
const { useTranslation } = i18next;

const NavBar = ({ focusCollapse, focusIcon }) => {
  const {
    i18n: { language },
  } = useTranslation(["component"]);

  const settingRef = useRef(null);

  const { user, userShare, post } = useContext(PostContext);
  const { owner } = useContext(AppContext);
  const dtf = new Intl.DateTimeFormat(language, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  const [{ value: da }, , { value: mo }, , { value: ye }] = dtf.formatToParts(
    new Date(post.date)
  );
  const handleClick = () => {
    const { current: fCollapse } = focusCollapse;
    if (!fCollapse.classList.contains("is-close"))
      fCollapse.classList.add("is-close");
    window.removeEventListener("click", handleClick);
  };

  const openSetting = () => {
    const { current } = settingRef;
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

    window.addEventListener("click", handleClick);
    focusCollapse.current = collapseItem;

    collapseItem.classList.toggle("is-close");
  };

  useEffect(() => {
    settingRef.current.addEventListener("click", openSetting);

    return () => {
      removeEventListener("click", openSetting);
      removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="post__item__navbar">
      {userShare && (
        <div
          className="post__item__navbar__user"
          onClick={() => {
            Router.push(`/profile/${userShare.id}`);
          }}
        >
          <div className="post__item__navbar__user--photo">
            <img
              src={"/static/images/" + userShare.photo}
              alt="Zdjęcie użytkownika"
              className="post__item__navbar__user--photo--img"
            />
          </div>
          <div className="post__item__navbar__user--name">
            <span
              className="post__item__navbar__user--name--span"
              data-testid="post-username"
            >
              {userShare.firstName + " " + userShare.lastName}
            </span>
          </div>
          <div className="post__item__navbar__user--share">
            <IoMdShareAlt />
          </div>
        </div>
      )}
      <div
        className="post__item__navbar__user"
        onClick={() => {
          Router.push(`/profile/${user.id}`);
        }}
      >
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
            {post?.idUserShare == owner.id || post.idUser == owner.id ? (
              <OwnerSettings />
            ) : (
              <UserSettings />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

import React, { useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";
import Router from "next/router";
import { BsThreeDots } from "react-icons/bs";
import { IoMdShareAlt } from "react-icons/io";
import i18next from "~i18n";
import UserSettings from "./components/UserSettings/UserSettings";
import OwnerSettings from "./components/OwnerSettings/OwnerSettings";
import PostContext from "../../context/PostContext";
import AppContext from "~features/context/AppContext";

const { useTranslation } = i18next;

const NavBar = ({ focusCollapse, focusIcon }) => {
  const {
    i18n: { language },
  } = useTranslation(["component"]);

  const settingRef = useRef(null);

  const { user, secondaryUser, post } = useContext(PostContext);
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
    if (!fCollapse.classList.contains("is-close")) {
      fCollapse.classList.add("is-close");
    }
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

    if (fIcon !== null && fIcon.classList.contains("is-visible")) {
      fIcon.classList.remove("is-visible");
    }

    window.addEventListener("click", handleClick);
    focusCollapse.current = collapseItem;

    collapseItem.classList.toggle("is-close");
  };

  useEffect(() => {
    settingRef.current.addEventListener("click", openSetting);

    return () => {
      settingRef.current.removeEventListener("click", openSetting);
      settingRef.current.removeEventListener("click", handleClick);
    };
  }, []);
  return (
    <div className="post__item__navbar">
      {secondaryUser && (
        <div
          className="post__item__navbar__user"
          onClick={() => {
            Router.push(`/profile/${secondaryUser.id}`);
          }}
          aria-hidden="true"
        >
          <div className="post__item__navbar__user__photo">
            <img
              src={`/static/images/${secondaryUser.photo}`}
              alt="Zdjęcie użytkownika"
              className="post__item__navbar__user__photo__img"
            />
          </div>
          <div className="post__item__navbar__user__name">
            <span
              className="post__item__navbar__user__name__span"
              data-testid="post-username"
            >
              {`${secondaryUser.firstName} ${secondaryUser.lastName}`}
            </span>
          </div>
          <div className="post__item__navbar__user__share">
            <IoMdShareAlt />
          </div>
        </div>
      )}
      <div
        className="post__item__navbar__user"
        onClick={() => {
          Router.push(`/profile/${user.id}`);
        }}
        aria-hidden="true"
      >
        <div className="post__item__navbar__user__photo">
          <img
            src={`/static/images/${user.photo}`}
            alt="Zdjęcie użytkownika"
            className="post__item__navbar__user__photo__img"
          />
        </div>
        <div className="post__item__navbar__user__name">
          <span
            className="post__item__navbar__user__name__span"
            data-testid="post-username"
          >
            {`${user.firstName} ${user.lastName}`}
          </span>
        </div>
      </div>
      <div className="post__item__navbar__column-end">
        <div className="post__item__navbar__column-end__data">
          <span
            className="post__item__navbar__column-end__data__span"
            data-testid="post-date"
          >
            {`${da} ${mo} ${ye}`}
          </span>
        </div>
        <div
          className="post__item__navbar__column-end__setting"
          data-testid="post-setting-icon"
          ref={settingRef}
          onClick={(e) => e.stopPropagation()}
          aria-hidden="true"
        >
          <div className="post__item__navbar__column-end__setting__icon">
            <BsThreeDots />
          </div>
          <div
            className="post__item__navbar__column-end__setting__collapse is-close"
            data-testid="post-setting"
          >
            {post?.postSharedUserId === owner.id || post.userId === owner.id ? (
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
const element = typeof Element === "undefined" ? () => {} : Element;

NavBar.defaultProps = {
  focusCollapse: null,
  focusIcon: null,
};

NavBar.propTypes = {
  focusCollapse: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(element) }),
  ]),
  focusIcon: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(element) }),
  ]),
};

export default NavBar;

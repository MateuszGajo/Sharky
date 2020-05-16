import React, { useRef, useEffect, useState, useContext } from "react";
import {
  AiOutlineHome,
  AiOutlineMessage,
  AiOutlineSetting,
} from "react-icons/ai";
import { GiWorld } from "react-icons/gi";
import { IoIosNotificationsOutline, IoMdArrowBack } from "react-icons/io";
import { MdPeopleOutline } from "react-icons/md";
import { TiGroupOutline, TiNews } from "react-icons/ti";
import { FaRegUser } from "react-icons/fa";
import cx from "classnames";
import Router from "next/router";
import { WizzardContext } from "../../context/WizzardContext";
import useTranslation from "next-translate/useTranslation";

const NavBar = () => {
  const { isNavOpen, setStatusOfNav } = useContext(WizzardContext);
  const navbar = useRef(null);
  const navbarWrapper = useRef(null);
  const [isNavbarScrolling, setStatusOfNavbarScrolling] = useState(false);

  const { t } = useTranslation();

  const homeName = t("component:layout.home.navbar.home");
  const worldName = t("component:layout.home.navbar.world");
  const notificationsName = t("component:layout.home.navbar.notifications");
  const messagesName = t("component:layout.home.navbar.messages");
  const friendsName = t("component:layout.home.navbar.friends");
  const groupsName = t("component:layout.home.navbar.groups");
  const fanpagesName = t("component:layout.home.navbar.fanpages");
  const profileName = t("component:layout.home.navbar.profile");
  const settingsName = t("component:layout.home.navbar.settings");

  let timeout = {
    navbar: null,
  };

  const showScroll = () => {
    if (timeout.navbar) {
      clearTimeout(timeout.navbar);
    }
    setStatusOfNavbarScrolling(true);

    timeout.navbar = setTimeout(() => {
      setStatusOfNavbarScrolling(false);
    }, 1000);
  };

  useEffect(() => {
    navbar.current.addEventListener("wheel", showScroll);
  }, []);

  useEffect(() => {
    const { current: wrapper } = navbarWrapper;
    isNavOpen
      ? wrapper.classList.add("home__wrapper--active")
      : wrapper.classList.remove("home__wrapper--active");
  }, [isNavOpen]);
  return (
    <div className="home__wrapper home__wrapper--large" ref={navbarWrapper}>
      <div
        className={cx("home__wrapper__navbar primary-scroll", {
          "primary-scroll-active": isNavbarScrolling,
        })}
        ref={navbar}
      >
        <div className="home__wrapper__navbar__title">
          <div
            className="home__wrapper__navbar__title__icon"
            onClick={() => setStatusOfNav(false)}
          >
            <IoMdArrowBack />
          </div>
          <h1 className="home__wrapper__navbar__title--h1">
            <span className="home__wrapper__navbar__title--h1--primaryColor">
              Sha
            </span>
            rky
          </h1>
        </div>
        <div className="home__wrapper__navbar__list">
          <div
            className="home__wrapper__navbar__list__item"
            onClick={() => Router.push("/")}
          >
            <div className="home__wrapper__navbar__list__item__icon">
              <AiOutlineHome />
            </div>
            <div className="home__wrapper__navbar__list__item__name">
              <a className="home__wrapper__navbar__list__item__name--a">
                {homeName}
              </a>
            </div>
          </div>
          <div
            className="home__wrapper__navbar__list__item"
            onClick={() => Router.push("/world")}
          >
            <div className="home__wrapper__navbar__list__item__icon">
              <GiWorld />
            </div>
            <div className="home__wrapper__navbar__list__item__name">
              <a className="home__wrapper__navbar__list__item__name--a">
                {worldName}
              </a>
            </div>
          </div>
          <div
            className="home__wrapper__navbar__list__item"
            onClick={() => Router.push("/notifications")}
          >
            <div className="home__wrapper__navbar__list__item__icon">
              <IoIosNotificationsOutline />
            </div>
            <div className="home__wrapper__navbar__list__item__name">
              <a className="home__wrapper__navbar__list__item__name--a">
                {notificationsName}
              </a>
            </div>
          </div>
          <div
            className="home__wrapper__navbar__list__item"
            onClick={() => Router.push("/messages")}
          >
            <div className="home__wrapper__navbar__list__item__icon">
              <AiOutlineMessage />
            </div>
            <div className="home__wrapper__navbar__list__item__name">
              <a className="home__wrapper__navbar__list__item__name--a">
                {messagesName}
              </a>
            </div>
          </div>
          <div
            className="home__wrapper__navbar__list__item"
            onClick={() => Router.push("/friends")}
          >
            <div className="home__wrapper__navbar__list__item__icon">
              <MdPeopleOutline />
            </div>
            <div className="home__wrapper__navbar__list__item__name">
              <a className="home__wrapper__navbar__list__item__name--a">
                {friendsName}
              </a>
            </div>
          </div>
          <div
            className="home__wrapper__navbar__list__item"
            onClick={() => Router.push("/groups")}
          >
            <div className="home__wrapper__navbar__list__item__icon">
              <TiGroupOutline />
            </div>
            <div className="home__wrapper__navbar__list__item__name">
              <a className="home__wrapper__navbar__list__item__name--a">
                {groupsName}
              </a>
            </div>
          </div>
          <div
            className="home__wrapper__navbar__list__item"
            onClick={() => Router.push("/fanpages")}
          >
            <div className="home__wrapper__navbar__list__item__icon">
              <TiNews />
            </div>
            <div className="home__wrapper__navbar__list__item__name">
              <a className="home__wrapper__navbar__list__item__name--a">
                {fanpagesName}
              </a>
            </div>
          </div>
          <div
            className="home__wrapper__navbar__list__item"
            onClick={() => Router.push("/profile")}
          >
            <div className="home__wrapper__navbar__list__item__icon">
              <FaRegUser />
            </div>
            <div className="home__wrapper__navbar__list__item__name">
              <a className="home__wrapper__navbar__list__item__name--a">
                {profileName}
              </a>
            </div>
          </div>
          <div
            className="home__wrapper__navbar__list__item"
            onClick={() => Router.push("/setting")}
          >
            <div className="home__wrapper__navbar__list__item__icon">
              <AiOutlineSetting />
            </div>
            <div className="home__wrapper__navbar__list__item__name">
              <a className="home__wrapper__navbar__list__item__name--a">
                {settingsName}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

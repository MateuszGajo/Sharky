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
import { FiLogOut } from "react-icons/fi";
import cx from "classnames";
import Router from "next/router";
import axios from "~features/service/Axios";
import AppContext from "~features/context/AppContext";
import i18next from "~i18n";
import Hamburger from "./components/Hamburger/Hamburger";

const { useTranslation } = i18next;

const NavBar = () => {
  const { t } = useTranslation(["component"]);

  const { owner, socket, setOwner } = useContext(AppContext);
  const navbar = useRef(null);
  const navbarWrapper = useRef(null);
  const [isNavbarScrolling, setStatusOfNavbarScrolling] = useState(false);
  const [isNavOpen, setStatusOfNav] = useState(false);

  const homeName = t("component:layout.home.navbar.home");
  const worldName = t("component:layout.home.navbar.world");
  const notificationsName = t("component:layout.home.navbar.notifications");
  const messagesName = t("component:layout.home.navbar.messages");
  const friendsName = t("component:layout.home.navbar.friends");
  const groupsName = t("component:layout.home.navbar.groups");
  const fanpagesName = t("component:layout.home.navbar.fanpages");
  const profileName = t("component:layout.home.navbar.profile");
  const settingsName = t("component:layout.home.navbar.settings");
  const logOutName = t("component:layout.home.navbar.log-out");

  let timeout;

  const navbarItems = [
    {
      id: 1,
      route: "",
      name: homeName,
      icon: <AiOutlineHome />,
    },
    {
      id: 2,
      route: "news",
      name: worldName,
      icon: <GiWorld />,
    },
    {
      id: 3,
      route: "notifications",
      name: notificationsName,
      icon: <IoIosNotificationsOutline />,
    },
    {
      id: 4,
      route: "messages",
      name: messagesName,
      icon: <AiOutlineMessage />,
    },
    {
      id: 5,
      route: "friends",
      name: friendsName,
      icon: <MdPeopleOutline />,
    },
    {
      id: 6,
      route: "groups",
      name: groupsName,
      icon: <TiGroupOutline />,
    },
    {
      id: 7,
      route: "fanpages",
      name: fanpagesName,
      icon: <TiNews />,
    },
    {
      id: 8,
      route: `profile/${owner.id}`,
      name: profileName,
      icon: <FaRegUser />,
    },
    {
      id: 9,
      route: "settings",
      name: settingsName,
      icon: <AiOutlineSetting />,
    },
  ];

  const logOut = () => {
    axios.get("/user/logout").then(() => {
      setOwner({ id: null });
      socket.emit("singleDisconnect");
      Router.push("/signin");
    });
  };

  const showScroll = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    setStatusOfNavbarScrolling(true);

    timeout = setTimeout(() => {
      setStatusOfNavbarScrolling(false);
    }, 1000);
  };

  useEffect(() => {
    navbar.current.addEventListener("wheel", showScroll);

    return () => {
      navbar.current.removeEventListener("whell", showScroll);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const { current: wrapper } = navbarWrapper;
    isNavOpen
      ? wrapper.classList.add("home__wrapper--active")
      : wrapper.classList.remove("home__wrapper--active");
  }, [isNavOpen]);
  return (
    <>
      <section className="home__hamburger">
        <Hamburger setStatusOfNav={setStatusOfNav} />
      </section>
      <div className="home__wrapper home__wrapper--large" ref={navbarWrapper}>
        <div
          className={cx("home__wrapper__navbar primary-scroll", {
            "primary-scroll--activee": isNavbarScrolling,
          })}
          ref={navbar}
        >
          <div className="home__wrapper__navbar__title">
            <div
              className="home__wrapper__navbar__title__icon"
              onClick={() => setStatusOfNav(false)}
              aria-hidden="true"
            >
              <IoMdArrowBack />
            </div>
            <h1 className="home__wrapper__navbar__title__h1">
              <span className="home__wrapper__navbar__title__h1--primaryColor">
                Sha
              </span>
              rky
            </h1>
          </div>
          <div className="home__wrapper__navbar__list">
            {navbarItems.map((item) => (
              <div
                key={item.id}
                className="home__wrapper__navbar__list__item"
                onClick={() => Router.push(`/${item.route}`)}
                aria-hidden="true"
              >
                <div className="home__wrapper__navbar__list__item__icon">
                  {item.icon}
                </div>
                <div className="home__wrapper__navbar__list__item__name">
                  <span className="home__wrapper__navbar__list__item__name__span">
                    {item.name}
                  </span>
                </div>
              </div>
            ))}
            <div
              className="home__wrapper__navbar__list__item"
              onClick={logOut}
              aria-hidden="true"
            >
              <div className="home__wrapper__navbar__list__item__icon">
                <FiLogOut />
              </div>
              <div className="home__wrapper__navbar__list__item__name">
                <span className="home__wrapper__navbar__list__item__name__span">
                  {logOutName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;

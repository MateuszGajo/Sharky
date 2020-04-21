import React, { useRef, useEffect, useState } from "react";
import {
  AiOutlineHome,
  AiOutlineMessage,
  AiOutlineSetting,
} from "react-icons/ai";
import { GiWorld } from "react-icons/gi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdPeopleOutline } from "react-icons/md";
import { TiGroupOutline, TiNews } from "react-icons/ti";
import { FaRegUser } from "react-icons/fa";
import cx from "classnames";

const NavBar = () => {
  const navbar = useRef(null);
  const [isNavbarScrolling, setStatusOfNavbarScrolling] = useState(false);

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
  return (
    <div className="fixed-container ">
      <div
        className={cx("home-wrapper__navbar primary-scroll", {
          "primary-scroll-active": isNavbarScrolling,
        })}
        ref={navbar}
      >
        <h1 className="home-wrapper__navbar--title">
          <span className="home-wrapper__navbar--title--primaryColor">Sha</span>
          rky
        </h1>
        <div className="home-wrapper__navbar__list">
          <div className="home-wrapper__navbar__list__item">
            <div className="home-wrapper__navbar__list__item--icon">
              <AiOutlineHome />
            </div>
            <div className="home-wrapper__navbar__list__item--name">
              <a className="home-wrapper__navbar__list__item--name--a">
                Główna
              </a>
            </div>
          </div>
          <div className="home-wrapper__navbar__list__item">
            <div className="home-wrapper__navbar__list__item--icon">
              <GiWorld />
            </div>
            <div className="home-wrapper__navbar__list__item--name">
              <a className="home-wrapper__navbar__list__item--name--a">Świat</a>
            </div>
          </div>
          <div className="home-wrapper__navbar__list__item">
            <div className="home-wrapper__navbar__list__item--icon">
              <IoIosNotificationsOutline />
            </div>
            <div className="home-wrapper__navbar__list__item--name">
              <a className="home-wrapper__navbar__list__item--name--a">
                Powiadomienia
              </a>
            </div>
          </div>
          <div className="home-wrapper__navbar__list__item">
            <div className="home-wrapper__navbar__list__item--icon">
              <AiOutlineMessage />
            </div>
            <div className="home-wrapper__navbar__list__item--name">
              <a className="home-wrapper__navbar__list__item--name--a">
                Wiadomośći
              </a>
            </div>
          </div>
          <div className="home-wrapper__navbar__list__item">
            <div className="home-wrapper__navbar__list__item--icon">
              <MdPeopleOutline />
            </div>
            <div className="home-wrapper__navbar__list__item--name">
              <a className="home-wrapper__navbar__list__item--name--a">
                Znajomi
              </a>
            </div>
          </div>
          <div className="home-wrapper__navbar__list__item">
            <div className="home-wrapper__navbar__list__item--icon">
              <TiGroupOutline />
            </div>
            <div className="home-wrapper__navbar__list__item--name">
              <a className="home-wrapper__navbar__list__item--name--a">Grupy</a>
            </div>
          </div>
          <div className="home-wrapper__navbar__list__item">
            <div className="home-wrapper__navbar__list__item--icon">
              <TiNews />
            </div>
            <div className="home-wrapper__navbar__list__item--name">
              <a className="home-wrapper__navbar__list__item--name--a">
                Fanpage
              </a>
            </div>
          </div>
          <div className="home-wrapper__navbar__list__item">
            <div className="home-wrapper__navbar__list__item--icon">
              <FaRegUser />
            </div>
            <div className="home-wrapper__navbar__list__item--name">
              <a className="home-wrapper__navbar__list__item--name--a">
                Profil
              </a>
            </div>
          </div>
          <div className="home-wrapper__navbar__list__item">
            <div className="home-wrapper__navbar__list__item--icon">
              <AiOutlineSetting />
            </div>
            <div className="home-wrapper__navbar__list__item--name">
              <a className="home-wrapper__navbar__list__item--name--a">
                Ustawienia
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

import React, { useRef, useEffect, useState } from "react";
import cx from "classnames";
import { AiOutlineCheck } from "react-icons/ai";
import useTranslation from "next-translate/useTranslation";
import HomeLayout from "../features/components/Layout/Home/HomeLayout";
import Home from "../features/components/Fanpage/Home/Home";
import Members from "../features/components/Fanpage/Members/Members";
import About from "../features/components/Fanpage/About/About";
import "../styles/main.scss";

const Fanpage = () => {
  const { t } = useTranslation();
  const homeName = t("fanpage:home");
  const membersName = t("fanpage:members");
  const aboutName = t("fanpage:about");
  const subscribeName = t("fanpage:subscribe");
  const subscribedName = t("fanpage:subscribed");

  const navbarItems = [homeName, membersName, aboutName];

  const navbarItem = useRef(
    [...new Array(navbarItems.length)].map(() => React.createRef())
  );
  const focusItem = useRef(null);
  const [section, setSection] = useState("Główna");

  const subscribe = true;

  const renderComponent = (name) => {
    switch (name) {
      case homeName:
        return <Home />;
      case membersName:
        return <Members />;
      case aboutName:
        return <About />;
      default:
        return <Home />;
    }
  };

  useEffect(() => {
    navbarItem.current.forEach((item) => {
      if (item.current.lastChild.outerText === homeName) {
        focusItem.current = item.current;
        item.current.classList.add("fanpage__navbar__item--active");
      }
      item.current.addEventListener("click", () => {
        if (focusItem.current !== item.current) {
          focusItem.current?.classList.remove("fanpage__navbar__item--active");
          item.current.classList.add("fanpage__navbar__item--active");
          focusItem.current = item.current;
        }
      });
    });
  }, []);
  return (
    <HomeLayout>
      <section className="fanpage">
        <div className="fanpage__navbar">
          {navbarItems.map((item, index) => (
            <div
              className="fanpage__navbar__item"
              key={index}
              ref={navbarItem.current[index]}
              onClick={() => {
                setSection(item);
              }}
            >
              <span className="fanpage__navbar__item--span">{item}</span>
            </div>
          ))}
          <div
            className={cx("fanpage__navbar__subscribe", {
              "fanpage__navbar__subscribe--active": subscribe,
            })}
          >
            <div className="fanpage__navbar__subscribe__icon">
              {subscribe ? <AiOutlineCheck /> : null}
            </div>
            <span className="fanpage__navbar__subscribe--span">
              {subscribe ? subscribedName : subscribeName}
            </span>
          </div>
        </div>
        <div className="fanpage__content">{renderComponent(section)}</div>
      </section>
    </HomeLayout>
  );
};

export default Fanpage;

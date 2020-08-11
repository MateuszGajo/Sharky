import React, { useRef, useEffect, useState, useContext } from "react";
import cx from "classnames";
import { AiOutlineCheck, AiOutlineDelete } from "react-icons/ai";
import { IoIosNotificationsOutline } from "react-icons/io";
import axios from "axios";
import { useRouter } from "next/router";
import HomeLayout from "../../features/components/Layout/Home/HomeLayout";
import Home from "../../features/components/Fanpage/Home/Home";
import Members from "../../features/components/Fanpage/Members/Members";
import About from "../../features/components/Fanpage/About/About";
import i18next from "@i18n";
import AppContext from "@features/context/AppContext";
import "../../styles/main.scss";

const { useTranslation } = i18next;

const Fanpage = () => {
  const router = useRouter();
  const idFanpage = router.query.id;
  const { t } = useTranslation(["fanpage"]);
  const homeName = t("fanpage:home");
  const membersName = t("fanpage:members");
  const aboutName = t("fanpage:about");
  const subscribeName = t("fanpage:subscribe");
  const subscribedName = t("fanpage:subscribed");
  const deleteFanpageText = t("fanpage:delete");

  const { setError } = useContext(AppContext);

  const navbarItems = [homeName, membersName, aboutName];

  const navbarItem = useRef(
    [...new Array(navbarItems.length)].map(() => React.createRef())
  );
  const focusItem = useRef(null);
  const [section, setSection] = useState(homeName);
  const [idSub, setIdSub] = useState(null);
  const [role, setRole] = useState(null);

  const subscribe = true;

  const deleteFanpage = () => {
    axios
      .post("/fanpage/delete", { idFanpage })
      .then(() => {
        router.push("/");
      })
      .catch(({ response: { message } }) => {
        setError(message);
      });
  };

  const subscribeFanpage = () => {
    axios
      .post("/fanpage/user/add", { idFanpage })
      .then(({ data: { id } }) => {
        setIdSub(id);
      })
      .catch(({ response: { message } }) => setError(message));
  };

  const unSubscribeFanpage = () => {
    axios
      .post("/fanpage/user/delete", { idSub })
      .then(() => {
        setIdSub(null);
      })
      .catch(({ response: { message } }) => setError(message));
  };

  const renderComponent = (name) => {
    switch (name) {
      case homeName:
        return <Home idFanpage={idFanpage} />;
      case membersName:
        return <Members idFanpage={idFanpage} role={role} />;
      case aboutName:
        return <About idFanpage={idFanpage} />;
      default:
        return <Home idFanpage={idFanpage} />;
    }
  };

  useEffect(() => {
    idFanpage &&
      axios
        .post("/fanpage/enter", { idFanpage })
        .then(({ data: { idSub, role } }) => {
          setIdSub(idSub);
          setRole(role);
        });
  }, [idFanpage]);

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
              "fanpage__navbar__subscribe--active": idSub,
            })}
            onClick={() => {
              idSub ? unSubscribeFanpage() : subscribeFanpage();
            }}
          >
            <div className="fanpage__navbar__subscribe__icon">
              {idSub ? <AiOutlineCheck /> : null}
            </div>
            <span className="fanpage__navbar__subscribe--span">
              {idSub ? subscribedName : subscribeName}
            </span>
            {role == "admin" && (
              <div className="fanpage__navbar__delete" onClick={deleteFanpage}>
                <div className="fanpage__navbar__delete__icon">
                  <AiOutlineDelete />
                </div>
                <span className="fanpage__navbar__delete__text">
                  {deleteFanpageText}
                </span>
              </div>
            )}
          </div>
          <div
            className={cx("fanpage__navbar__subscribe--mobile", {
              "fanpage__navbar__subscribe--mobile--active": subscribe,
            })}
          >
            <div className="fanpage__navbar__subscribe--mobile__icon">
              <IoIosNotificationsOutline />
            </div>
          </div>
        </div>
        <div
          className={cx("fanpage__content", {
            "fanpage__content--margin": section !== aboutName,
            "fanpage__content--grow": section === aboutName,
          })}
        >
          {renderComponent(section)}
        </div>
      </section>
    </HomeLayout>
  );
};

export default Fanpage;

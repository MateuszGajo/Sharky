import React, { useContext, useRef, useEffect } from "react";
import axios from "axios";
import cx from "classnames";
import { useRouter } from "next/router";
import { AiOutlineCheck, AiOutlineDelete } from "react-icons/ai";
import { IoIosNotificationsOutline } from "react-icons/io";
import i18next from "@i18n";
import AppContext from "@features/context/AppContext";
const { useTranslation } = i18next;

const Navbar = ({ setIdSub, setSection, idSub, role, idFanpage }) => {
  const { t } = useTranslation(["fanpage"]);

  const router = useRouter();

  const { setError } = useContext(AppContext);

  const focusItem = useRef(null);

  const subscribeName = t("fanpage:subscribe");
  const subscribedName = t("fanpage:subscribed");
  const deleteFanpageText = t("fanpage:delete");
  const homeName = t("fanpage:home");
  const membersName = t("fanpage:members");
  const aboutName = t("fanpage:about");

  const navbarItems = [homeName, membersName, aboutName];
  const navbarItem = useRef(
    [...new Array(navbarItems.length)].map(() => React.createRef())
  );

  const deleteFanpage = (e) => {
    e.stopPropagation();
    axios
      .post("/fanpage/delete", { idFanpage })
      .then(() => {
        router.push("/");
      })
      .catch(({ response: { data: message } }) => {
        setError(message);
      });
  };

  const subscribeFanpage = () => {
    axios
      .post("/fanpage/user/add", { idFanpage })
      .then(({ data: { id } }) => {
        setIdSub(id);
      })
      .catch(({ response: { data: message } }) => setError(message));
  };

  const unSubscribeFanpage = () => {
    axios
      .post("/fanpage/user/delete", { idSub, role, idFanpage })
      .then(() => {
        setIdSub(null);
      })
      .catch(({ response: { data: message } }) => setError(message));
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
          "fanpage__navbar__subscribe--mobile--active": idSub,
        })}
        onClick={() => {
          idSub ? unSubscribeFanpage() : subscribeFanpage();
        }}
      >
        <div className="fanpage__navbar__subscribe--mobile__icon">
          <IoIosNotificationsOutline />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

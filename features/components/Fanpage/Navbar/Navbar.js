import React, { useContext, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import cx from "classnames";
import { useRouter } from "next/router";
import { AiOutlineCheck, AiOutlineDelete } from "react-icons/ai";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdPhotoCamera } from "react-icons/md";
import i18next from "@i18n";
import AppContext from "@features/context/AppContext";
const { useTranslation } = i18next;

const Navbar = ({ setIdSub, setSection, subId, role, fanpageId }) => {
  const { t } = useTranslation(["fanpage"]);

  const router = useRouter();

  const { setError, setPrompt } = useContext(AppContext);

  const focusItem = useRef(null);

  const subscribeName = t("fanpage:subscribe");
  const subscribedName = t("fanpage:subscribed");
  const deleteFanpageText = t("fanpage:delete");
  const changePhotoText = t("fanpage:change-photo");
  const changedPhoto = t("fanpage:changed-photo");
  const homeName = t("fanpage:home");
  const membersName = t("fanpage:members");
  const aboutName = t("fanpage:about");

  const navbarItems = [homeName, membersName, aboutName];
  const navbarItem = useRef(
    [...new Array(navbarItems.length)].map(() => React.createRef())
  );

  const deleteFanpage = (e) => {
    axios
      .post("/fanpage/delete", { fanpageId })
      .then(() => {
        router.push("/");
      })
      .catch(({ response: { data: message } }) => {
        setError(message);
      });
  };

  const changePhoto = (e) => {
    e.stopPropagation();
    const file = e.target.files[0];
    if (!file) return;

    if (file.type != "image/png" && file.type != "image/jpeg") {
      return setError("wrong-file-type");
    }
    if (file.size > 200000) {
      return setError("file-too-large");
    }

    const data = new FormData();
    data.append("file", e.target.files[0]);
    data.set("fanpageId", fanpageId);

    axios
      .post("/fanpage/change/photo", data)
      .then(() => {
        setPrompt(changedPhoto);
      })
      .catch(({ response: { data: message } }) => setError(message));
  };

  const subscribeFanpage = () => {
    axios
      .post("/fanpage/user/add", { fanpageId })
      .then(({ data: { id } }) => {
        setIdSub(id);
      })
      .catch(({ response: { data: message } }) => setError(message));
  };

  const unSubscribeFanpage = () => {
    axios
      .post("/fanpage/user/delete", { subId, role, fanpageId })
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
          <span className="fanpage__navbar__item__span">{item}</span>
        </div>
      ))}
      <div
        className={cx("fanpage__navbar__subscribe", {
          "fanpage__navbar__subscribe--active": subId,
        })}
        onClick={() => {
          subId ? unSubscribeFanpage() : subscribeFanpage();
        }}
      >
        <div className="fanpage__navbar__subscribe__icon">
          {subId ? <AiOutlineCheck /> : null}
        </div>
        <span className="fanpage__navbar__subscribe__span">
          {subId ? subscribedName : subscribeName}
        </span>
        {role == "admin" && (
          <div className="fanpage__navbar__admin-panel">
            <div
              className="fanpage__navbar__admin-panel__item"
              onClick={deleteFanpage}
            >
              <div className="fanpage__navbar__admin-panel__item__icon">
                <AiOutlineDelete />
              </div>
              <span className="fanpage__navbar__admin-panel__item__text">
                {deleteFanpageText}
              </span>
            </div>
            <div
              className="fanpage__navbar__admin-panel__item fanpage__navbar__admin-panel__item--no-padding"
              onClick={(e) => e.stopPropagation()}
            >
              <label
                className="fanpage__navbar__admin-panel__item__label"
                htmlFor="change-fanpage-photo"
              >
                <div className="fanpage__navbar__admin-panel__item__icon">
                  <MdPhotoCamera />
                </div>
                <span className="fanpage__navbar__admin-panel__item__text">
                  {changePhotoText}
                </span>
              </label>
              <input
                type="file"
                id="change-fanpage-photo"
                onChange={changePhoto}
              />
            </div>
          </div>
        )}
      </div>
      <div
        className={cx("fanpage__navbar__subscribe--mobile", {
          "fanpage__navbar__subscribe--mobile--active": subId,
        })}
        onClick={() => {
          subId ? unSubscribeFanpage() : subscribeFanpage();
        }}
      >
        <div className="fanpage__navbar__subscribe--mobile__icon">
          <IoIosNotificationsOutline />
        </div>
      </div>
    </div>
  );
};

Navbar.propTypes = {
  setIdSub: PropTypes.func,
  setSection: PropTypes.func,
  subId: PropTypes.number,
  role: PropTypes.string,
  fanpageId: PropTypes.number.isRequired
}

export default Navbar;

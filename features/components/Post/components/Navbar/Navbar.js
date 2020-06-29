import React, { useEffect, useRef } from "react";
import { BsEyeSlash, BsThreeDots } from "react-icons/bs";
import { FiVolumeX, FiFlag } from "react-icons/fi";
import { MdBlock } from "react-icons/md";
import { IoMdShareAlt } from "react-icons/io";
import { IconContext } from "react-icons";
import i18next from "../../../../../i18n";
import { muteUser, blockUser } from "../../services/Functions/index";
const { useTranslation } = i18next;

const NavBar = ({
  date,
  user,
  shareUser,
  idUser,
  focusCollapse,
  focusIcon,
  setStatusOfHiddenPost,
  posts,
  setPosts,
}) => {
  const { t, lang } = useTranslation(["component"]);
  const hiddenPostText = t("component:post.settings.hidden");
  const reportPostText = t("component:post.settings.report");
  const muteUserText = t("component:post.settings.mute");
  const blockUserText = t("component:post.settings.block");

  const settingRef = useRef(null);

  const dtf = new Intl.DateTimeFormat(lang || "pl", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  const [{ value: da }, , { value: mo }, , { value: ye }] = dtf.formatToParts(
    new Date(date)
  );

  const clickHandle = (e) => {
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
            <div
              className="post__item__navbar__column-end__setting__collapse__item"
              onClick={() => setStatusOfHiddenPost(true)}
            >
              <div className="post__item__navbar__column-end__setting__collapse__item--icon">
                <IconContext.Provider
                  value={{
                    className:
                      "post__item__navbar__column-end__setting__collapse__item--icon--customize",
                  }}
                >
                  <BsEyeSlash />
                </IconContext.Provider>
              </div>
              <div className="post__item__navbar__column-end__setting__collapse__item--name">
                <span className="post__item__navbar__column-end__setting__collapse__item--name--span">
                  {hiddenPostText}
                </span>
              </div>
            </div>
            <div
              className="post__item__navbar__column-end__setting__collapse__item"
              onClick={() =>
                muteUser({
                  idMuteUser: idUser,
                  posts,
                  setPosts,
                })
              }
            >
              <div className="post__item__navbar__column-end__setting__collapse__item--icon">
                <IconContext.Provider
                  value={{
                    className:
                      "post__item__navbar__column-end__setting__collapse__item--icon--customize",
                  }}
                >
                  <FiVolumeX />
                </IconContext.Provider>
              </div>
              <div className="post__item__navbar__column-end__setting__collapse__item--name">
                <span className="post__item__navbar__column-end__setting__collapse__item--name--span">
                  {muteUserText}
                </span>
              </div>
            </div>
            <div className="post__item__navbar__column-end__setting__collapse__item">
              <div className="post__item__navbar__column-end__setting__collapse__item--icon">
                <IconContext.Provider
                  value={{
                    className:
                      "post__item__navbar__column-end__setting__collapse__item--icon--customize",
                  }}
                >
                  <FiFlag />
                </IconContext.Provider>
              </div>
              <div className="post__item__navbar__column-end__setting__collapse__item--name">
                <span className="post__item__navbar__column-end__setting__collapse__item--name--span">
                  {reportPostText}
                </span>
              </div>
            </div>
            <div
              className="post__item__navbar__column-end__setting__collapse__item"
              onClick={() =>
                blockUser({ idBlockUser: idUser, posts, setPosts })
              }
            >
              <div className="post__item__navbar__column-end__setting__collapse__item--icon">
                <IconContext.Provider
                  value={{
                    className:
                      "post__item__navbar__column-end__setting__collapse__item--icon--customize",
                  }}
                >
                  <MdBlock />
                </IconContext.Provider>
              </div>
              <div className="post__item__navbar__column-end__setting__collapse__item--name">
                <span className="post__item__navbar__column-end__setting__collapse__item--name--span">
                  {blockUserText}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

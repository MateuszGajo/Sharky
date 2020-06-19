import React, { useRef, useEffect } from "react";
import { IoIosHeartEmpty } from "react-icons/io";
import { FiMessageCircle, FiVolumeX, FiFlag } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { IconContext } from "react-icons";
import i18next from "../../../../../i18n";
const { useTranslation } = i18next;

const Commnet = ({
  comment,
  user,
  setStatusOfOpenReplies,
  isRepliesOpen,
  focusCollapse,
  focusIcon,
}) => {
  const { t } = useTranslation(["component"]);

  const settingRef = useRef(null);
  const reportComment = t("component:post.comments.settings.report");
  const muteUser = t("component:post.comments.settings.mute");

  const clickHandle = (e) => {
    const { current: fCollapse } = focusCollapse;
    const { current: fIcon } = focusIcon;
    if (!fCollapse.classList.contains("is-close"))
      fCollapse.classList.add("is-close");

    if (fIcon.classList.contains("is-visible"))
      fIcon.classList.remove("is-visible");

    window.removeEventListener("click", clickHandle);
  };

  useEffect(() => {
    const { current } = settingRef;
    current.addEventListener("click", (e) => {
      const collapseItem = current.querySelector(
        ".post__item__comments__container__item__content__item__top-bar__icon__collapse "
      );
      const { current: fCollapse } = focusCollapse;
      const { current: fItem } = focusIcon;
      if (fCollapse !== collapseItem && fCollapse !== null) {
        fCollapse.classList.add("is-close");
      }

      if (fItem !== null && !fItem.classList.contains("is-visible"))
        fItem.classList.remove("is-visible");

      window.addEventListener("click", clickHandle);

      current.classList.toggle("is-visible");
      focusIcon.current = current;

      collapseItem.classList.toggle("is-close");
      focusCollapse.current = collapseItem;
    });
  }, []);
  return (
    <div className="post__item__comments__container__item">
      <div className="post__item__comments__container__item__photo">
        <img
          src={"/static/images/" + user.photo}
          alt=""
          className="post__item__comments__container__item__photo--img"
        />
      </div>
      <div className="post__item__comments__container__item__content">
        <div className="post__item__comments__container__item__content__item">
          <div className="post__item__comments__container__item__content__item__top-bar">
            <div className="post__item__comments__container__item__content__item__top-bar__user-name">
              <span className="post__item__comments__container__item__content__item__top-bar__user-name--span">
                {user.firstName + " " + user.lastName}
              </span>
            </div>
            <div
              className="post__item__comments__container__item__content__item__top-bar__icon"
              ref={settingRef}
              onClick={(e) => e.stopPropagation()}
            >
              <BsThreeDots />
              <div className="post__item__comments__container__item__content__item__top-bar__icon__collapse is-close">
                <div className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item">
                  <div className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item--icon">
                    <IconContext.Provider
                      value={{
                        className:
                          "post__item__comments__container__item__content__item__top-bar__icon__collapse__item--icon--customize",
                      }}
                    >
                      <FiVolumeX />
                    </IconContext.Provider>
                  </div>
                  <div className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item--name">
                    <span className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item--name--span">
                      {muteUser}
                    </span>
                  </div>
                </div>
                <div className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item">
                  <div className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item--icon">
                    <IconContext.Provider
                      value={{
                        className:
                          "post__item__comments__container__item__content__item__top-bar__icon__collapse__item--icon--customize",
                      }}
                    >
                      <FiFlag />
                    </IconContext.Provider>
                  </div>
                  <div className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item--name">
                    <span className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item--name--span">
                      {reportComment}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="post__item__comments__container__item__content__item__text">
            {comment.content}
          </div>
          <div className="post__item__comments__container__item__content__item__down-bar">
            <div className="post__item__comments__container__item__content__item__down-bar--icon hover-pal-color">
              <IoIosHeartEmpty />
              <span className="post__item__comments__container__item__content__item__down-bar--icon--number">
                {comment.likes}
              </span>
            </div>
            {comment.replies && (
              <div
                className="post__item__comments__container__item__content__item__down-bar--icon hover-primary-color"
                onClick={() => setStatusOfOpenReplies(!isRepliesOpen)}
              >
                <FiMessageCircle />
                <span className="post__item__comments__container__item__content__item__down-bar--icon--number">
                  {comment.replies.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Commnet;

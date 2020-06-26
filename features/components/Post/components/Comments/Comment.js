import React, { useRef, useEffect, useState } from "react";
import { IoIosHeartEmpty } from "react-icons/io";
import { FiMessageCircle, FiVolumeX, FiFlag } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { IconContext } from "react-icons";
import cx from "classnames";
import i18next from "../../../../../i18n";
import {
  likeComment,
  unlikeComment,
  likeReply,
  unlikeReply,
} from "../../services/Functions/index";

const { useTranslation } = i18next;

const Commnet = ({
  comment,
  user,
  setStatusOfOpenReplies,
  isRepliesOpen,
  focusCollapse,
  focusIcon,
  getReplies,
}) => {
  const { t } = useTranslation(["component"]);

  const settingRef = useRef(null);
  const reportComment = t("component:post.comments.settings.report");
  const muteUser = t("component:post.comments.settings.mute");
  const [idLike, setIdLike] = useState(comment.idLike);

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

  const setlikeComment = () => {
    if ("numberOfReplies" in comment) {
      idLike
        ? unlikeComment({ idLike, setIdLike })
        : likeComment({ idComment: comment.id, setIdLike });
    } else {
      idLike
        ? unlikeReply({ idLike, setIdLike })
        : likeReply({ idReply: comment.id, setIdLike });
    }
  };
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
            <div
              className={cx(
                "post__item__comments__container__item__content__item__down-bar--icon hover-pal-color",
                {
                  "pal-color": idLike,
                }
              )}
              onClick={() => {
                setlikeComment();
              }}
            >
              <IoIosHeartEmpty />
              <span className="post__item__comments__container__item__content__item__down-bar--icon--number">
                {comment.numberOfLikes}
              </span>
            </div>
            {comment.numberOfReplies >= 0 && (
              <div
                className="post__item__comments__container__item__content__item__down-bar--icon hover-primary-color"
                onClick={() => {
                  if (!isRepliesOpen) {
                    getReplies();
                  }
                  setStatusOfOpenReplies(!isRepliesOpen);
                }}
              >
                <FiMessageCircle />
                <span className="post__item__comments__container__item__content__item__down-bar--icon--number">
                  {comment.numberOfReplies}
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

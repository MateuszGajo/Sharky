import React, { useRef, useEffect, useState, useContext } from "react";
import { IoIosHeartEmpty } from "react-icons/io";
import { FiMessageCircle, FiVolumeX, FiFlag } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { IconContext } from "react-icons";
import cx from "classnames";
import Router from "next/router";
import i18next from "@i18n";
import {
  likeComment,
  unlikeComment,
  likeReply,
  unlikeReply,
} from "../../services/Functions";
import WizzardContext from "../../context/WizzardContext";
import AppContext from "@features/context/AppContext";

const { useTranslation } = i18next;

const Commnet = ({
  comment,
  setStatusOfOpenReplies,
  numberOfReplies,
  isRepliesOpen,
  focusCollapse,
  focusIcon,
  getReplies,
  user,
}) => {
  const { t } = useTranslation(["component"]);

  const { id, firstName, lastName, photo } = user;

  const { setError } = useContext(AppContext);
  const { newLike, setNewLike } = useContext(WizzardContext);

  const settingRef = useRef(null);
  const reportComment = t("component:post.comments.settings.report");
  const muteUser = t("component:post.comments.settings.mute");
  const [likeId, setIdLike] = useState(comment?.likeId);
  const [numberOfLikes, setNumberOfLikes] = useState(
    Number(comment.numberOfLikes)
  );

  const handleClick = () => {
    const { current: fCollapse } = focusCollapse;
    const { current: fIcon } = focusIcon;
    if (!fCollapse.classList.contains("is-close"))
      fCollapse.classList.add("is-close");

    if (fIcon.classList.contains("is-visible"))
      fIcon.classList.remove("is-visible");

    window.removeEventListener("click", handleClick);
  };

  const setlikeComment = () => {
    if (likeId) {
      "numberOfReplies" in comment
        ? unlikeComment({
            likeId,
            commnetId: comment.commnetId,
            setNewLike,
            setError,
          })
        : unlikeReply({
            likeId,
            replyId: comment.replyId,
            setNewLike,
            setError,
          });
    } else {
      "numberOfReplies" in comment
        ? likeComment({ commnetId: comment.commnetId, setNewLike, setError })
        : likeReply({ replyId: comment.replyId, setNewLike, setError });
    }
  };

  const openSetting = () => {
    const { current } = settingRef;
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

    window.addEventListener("click", handleClick);

    current.classList.toggle("is-visible");
    focusIcon.current = current;

    collapseItem.classList.toggle("is-close");
    focusCollapse.current = collapseItem;
  };

  useEffect(() => {
    settingRef.current.addEventListener("click", openSetting);

    return () => {
      removeEventListener("click", openSetting);
      removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    if (
      newLike.type == "comment" &&
      newLike.idElement == comment.commnetId &&
      numberOfReplies != undefined
    ) {
      setIdLike(newLike.likeId);
      newLike.likeId
        ? setNumberOfLikes(numberOfLikes + 1)
        : setNumberOfLikes(numberOfLikes - 1);
    } else if (
      newLike.type == "reply" &&
      newLike.idElement == comment.replyId &&
      numberOfReplies == undefined
    ) {
      setIdLike(newLike.likeId);
      newLike.likeId
        ? setNumberOfLikes(numberOfLikes + 1)
        : setNumberOfLikes(numberOfLikes - 1);
    }
  }, [newLike]);

  return (
    <div className="post__item__comments__container__item">
      <div
        className="post__item__comments__container__item__photo"
        onClick={() => {
          Router.push(`/profile/${id}`);
        }}
      >
        <img
          src={"/static/images/" + photo}
          alt=""
          className="post__item__comments__container__item__photo--img"
        />
      </div>
      <div className="post__item__comments__container__item__content">
        <div className="post__item__comments__container__item__content__item">
          <div className="post__item__comments__container__item__content__item__top-bar">
            <div
              className="post__item__comments__container__item__content__item__top-bar__user-name"
              onClick={() => {
                Router.push(`/profile/${id}`);
              }}
            >
              <span className="post__item__comments__container__item__content__item__top-bar__user-name__span">
                {firstName + " " + lastName}
              </span>
            </div>
            <div
              className="post__item__comments__container__item__content__item__top-bar__icon"
              ref={settingRef}
              onClick={(e) => e.stopPropagation()}
            >
              <BsThreeDots />
              <div className="post__item__comments__container__item__content__item__top-bar__icon__collapse is-close">
                <div
                  className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item"
                  onClick={() => muteUser({ idMuteUser: id, posts })}
                >
                  <div className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item__icon">
                    <IconContext.Provider
                      value={{
                        className:
                          "post__item__comments__container__item__content__item__top-bar__icon__collapse__item__icon__customize",
                      }}
                    >
                      <FiVolumeX />
                    </IconContext.Provider>
                  </div>
                  <div className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item__name">
                    <span className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item__name__span">
                      {muteUser}
                    </span>
                  </div>
                </div>
                <div className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item">
                  <div className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item__icon">
                    <IconContext.Provider
                      value={{
                        className:
                          "post__item__comments__container__item__content__item__top-bar__icon__collapse__item__icon__customize",
                      }}
                    >
                      <FiFlag />
                    </IconContext.Provider>
                  </div>
                  <div className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item__name">
                    <span className="post__item__comments__container__item__content__item__top-bar__icon__collapse__item__name__span">
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
                "post__item__comments__container__item__content__item__down-bar__icon hover-pal-color",
                {
                  "pal-color": likeId,
                }
              )}
              onClick={() => {
                setlikeComment();
              }}
            >
              <IoIosHeartEmpty />
              <span className="post__item__comments__container__item__content__item__down-bar__icon__number">
                {numberOfLikes}
              </span>
            </div>
            {numberOfReplies != undefined && (
              <div
                className="post__item__comments__container__item__content__item__down-bar__icon hover-primary-color"
                onClick={() => {
                  if (!isRepliesOpen) {
                    getReplies();
                  }
                  setStatusOfOpenReplies(!isRepliesOpen);
                }}
              >
                <FiMessageCircle />
                <span className="post__item__comments__container__item__content__item__down-bar__icon__number">
                  {numberOfReplies}
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

import React, { useRef, useEffect } from "react";
import { BsEyeSlash, BsThreeDots } from "react-icons/bs";
import { FiVolumeX, FiFlag } from "react-icons/fi";
import { MdBlock } from "react-icons/md";
import { IconContext } from "react-icons";
import useTranslation from "next-translate/useTranslation";
import DownBarButtons from "../../common/DownBarButtons/DownBarButtons";
import Comments from "./components/Comments/Comments";
import Router from "../../routes";

const Post = ({
  post = {
    id: 1,
    userId: 123,
    content: "dasdsa",
    date: new Date("2019-03-25"),
    photo: "profile.png",
  },
  user = {
    id: 123,
    firstName: "Janek",
    lastName: "Kowalski",
    photo: "profile.png",
  },
  singlePost = true,
  focusElement: fElement = null,
}) => {
  const { t, lang } = useTranslation();

  const collapseSetting = useRef(null);
  const focusElement = useRef(fElement?.current || null);
  const dtf = new Intl.DateTimeFormat(lang || "pl", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  const [{ value: da }, , { value: mo }, , { value: ye }] = dtf.formatToParts(
    post.date
  );

  const hiddenPost = t("component:post.settings.hidden");
  const reportPost = t("component:post.settings.report");
  const muteUser = t("component:post.settings.mute");
  const blockUser = t("component:post.settings.block");

  const clickHandle = (e) => {
    if (!focusElement.current.classList.contains("is-close"))
      focusElement.current.classList.add("is-close");
    window.removeEventListener("click", clickHandle);
  };

  useEffect(() => {
    collapseSetting.current.addEventListener("click", () => {
      const collapseItem = collapseSetting.current.querySelector(
        ".post__item__navbar__column-end__setting__collapse"
      );
      const { current: lastItem } = focusElement;
      if (lastItem !== collapseItem && lastItem !== null) {
        lastItem.classList.add("is-close");
      }
      window.addEventListener("click", clickHandle);
      focusElement.current = collapseItem;

      collapseItem.classList.toggle("is-close");
    });
  }, []);
  return (
    <div className="post__item">
      <div className="post__item__navbar">
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
            ref={collapseSetting}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="post__item__navbar__column-end__setting--icon">
              <BsThreeDots />
            </div>
            <div
              className="post__item__navbar__column-end__setting__collapse is-close"
              data-testid="post-setting"
            >
              <div className="post__item__navbar__column-end__setting__collapse__item">
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
                    {hiddenPost}
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
                    <FiVolumeX />
                  </IconContext.Provider>
                </div>
                <div className="post__item__navbar__column-end__setting__collapse__item--name">
                  <span className="post__item__navbar__column-end__setting__collapse__item--name--span">
                    {muteUser}
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
                    {reportPost}
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
                    <MdBlock />
                  </IconContext.Provider>
                </div>
                <div className="post__item__navbar__column-end__setting__collapse__item--name">
                  <span className="post__item__navbar__column-end__setting__collapse__item--name--span">
                    {blockUser}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="post__item__content"
        onClick={() => {
          Router.pushRoute("post", { id: post.id });
        }}
      >
        <span className="post__item__content--span" data-testid="post-content">
          {post.content}
        </span>
      </div>
      {post?.photo && (
        <div
          className="post__item__photo"
          data-testid="post-photo"
          onClick={() => {
            Router.pushRoute("post", { id: post.id });
          }}
        >
          <img
            src={"/static/images/" + post.photo}
            alt=""
            className="post__item__photo--img"
          />
        </div>
      )}
      <div className="post__item__downbar">
        <DownBarButtons postId={post.id} />
      </div>
      <div className="post__item__comments" data-testid="post-comments">
        {singlePost === true ? <Comments focusElement={focusElement} /> : null}
      </div>
    </div>
  );
};

export default Post;

import React, { useRef, useEffect, useState } from "react";
import { BsEyeSlash, BsVolumeMute, BsFlag, BsThreeDots } from "react-icons/bs";
import { FiVolumeX, FiFlag } from "react-icons/fi";
import { MdBlock } from "react-icons/md";
import { IconContext } from "react-icons";
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
  focusElement = null,
}) => {
  const collapseSetting = useRef(null);

  const dtf = new Intl.DateTimeFormat("pl", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  const [{ value: da }, , { value: mo }, , { value: ye }] = dtf.formatToParts(
    post.date
  );

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
    <div
      className="post__item"
      onClick={() => {
        // Router.pushRoute("post", { id: post.id });
      }}
    >
      {console.log(focusElement)}
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
            <span className="post__item__navbar__user--name--span">
              {user.firstName + " " + user.lastName}
            </span>
          </div>
        </div>
        <div className="post__item__navbar__column-end">
          <div className="post__item__navbar__column-end__data">
            <span className="post__item__navbar__column-end__data--span">
              {da} {mo} {ye}
            </span>
          </div>
          <div
            className="post__item__navbar__column-end__setting"
            ref={collapseSetting}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="post__item__navbar__column-end__setting--icon">
              <BsThreeDots />
            </div>
            <div className="post__item__navbar__column-end__setting__collapse is-close">
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
                    Ukryj post
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
                    Wycisz użytkownika
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
                    Zgłoś post
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
                    Zablokuj użytkownika
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="post__item__content">
        <span className="post__item__content--span">{post.content}</span>
      </div>
      {post.photo !== null && (
        <div className="post__item__photo">
          <img
            src={"/static/images/" + post.photo}
            alt=""
            className="post__item__photo--img"
          />
        </div>
      )}
      <div className="post__item__downbar">
        <DownBarButtons />
      </div>
      <div className="post__item__comments">
        {singlePost === true ? <Comments focusElement={focusElement} /> : null}
      </div>
    </div>
  );
};

export default Post;

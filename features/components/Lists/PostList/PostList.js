import React, { useRef, useEffect, useState } from "react";
import { BsEyeSlash, BsVolumeMute, BsFlag, BsThreeDots } from "react-icons/bs";
import { MdBlock } from "react-icons/md";
import { IconContext } from "react-icons";
import DownBarButtons from "../../../common/DownBarButtons/DownBarButtons";
import Comments from "./components/Comments/Comments";

const PostList = ({
  posts = [
    {
      id: 1,
      content: "dasdsa",
      date: new Date("2019-03-25"),
      photo: "profile.png",
    },
    {
      id: 2,
      content: "dasdsa",
      date: new Date("2015-03-25"),
      photo: null,
    },
  ],
  user = {
    id: 345,
    firstName: "Jan",
    lastName: "Kowalski",
    photo: "profile.png",
  },
}) => {
  const collapseSetting = useRef([React.createRef(), React.createRef()]);
  const lastCollapseElement = useRef(null);

  useEffect(() => {
    collapseSetting.current.forEach((item) => {
      item.current.addEventListener("click", () => {
        const collapseItem = item.current.querySelector(
          ".post-list__item__navbar__column-end__setting__collapse"
        );
        const { current } = lastCollapseElement;
        if (
          current !== null &&
          !current?.classList?.contains("is-close") &&
          current !== collapseItem
        ) {
          lastCollapseElement.current.classList.add("is-close");
        }

        lastCollapseElement.current = collapseItem;
        collapseItem.classList.toggle("is-close");
      });
    });
  }, []);
  return (
    <div className="post-list">
      {posts.map((post, index) => {
        const dtf = new Intl.DateTimeFormat("pl", {
          year: "numeric",
          month: "long",
          day: "2-digit",
        });
        const [
          { value: da },
          ,
          { value: mo },
          ,
          { value: ye },
        ] = dtf.formatToParts(post.date);
        return (
          <div className="post-list__item" key={post.id}>
            <div className="post-list__item__navbar">
              <div className="post-list__item__navbar__user">
                <div className="post-list__item__navbar__user--photo">
                  <img
                    src={"/static/images/" + user.photo}
                    alt="Zdjęcie użytkownika"
                    className="post-list__item__navbar__user--photo--img"
                  />
                </div>
                <div className="post-list__item__navbar__user--name">
                  <span className="post-list__item__navbar__user--name--span">
                    {user.firstName + " " + user.lastName}
                  </span>
                </div>
              </div>
              <div className="post-list__item__navbar__column-end">
                <div className="post-list__item__navbar__column-end__data">
                  <span className="post-list__item__navbar__column-end__data--span">
                    {da} {mo} {ye}
                  </span>
                </div>
                <div
                  className="post-list__item__navbar__column-end__setting"
                  ref={collapseSetting.current[index]}
                >
                  <div className="post-list__item__navbar__column-end__setting--icon">
                    <BsThreeDots />
                  </div>
                  <div className="post-list__item__navbar__column-end__setting__collapse is-close">
                    <div className="post-list__item__navbar__column-end__setting__collapse__item">
                      <div className="post-list__item__navbar__column-end__setting__collapse__item--icon">
                        <BsEyeSlash />
                      </div>
                      <div className="post-list__item__navbar__column-end__setting__collapse__item--name">
                        <span className="post-list__item__navbar__column-end__setting__collapse__item--name--span">
                          Ukryj post
                        </span>
                      </div>
                    </div>
                    <div className="post-list__item__navbar__column-end__setting__collapse__item">
                      <div className="post-list__item__navbar__column-end__setting__collapse__item--icon">
                        <IconContext.Provider
                          value={{
                            size: "30px",
                          }}
                        >
                          <BsVolumeMute />
                        </IconContext.Provider>
                      </div>
                      <div className="post-list__item__navbar__column-end__setting__collapse__item--name">
                        <span className="post-list__item__navbar__column-end__setting__collapse__item--name--span">
                          Wycisz użytkownika
                        </span>
                      </div>
                    </div>
                    <div className="post-list__item__navbar__column-end__setting__collapse__item">
                      <div className="post-list__item__navbar__column-end__setting__collapse__item--icon">
                        <BsFlag />
                      </div>
                      <div className="post-list__item__navbar__column-end__setting__collapse__item--name">
                        <span className="post-list__item__navbar__column-end__setting__collapse__item--name--span">
                          Zgłoś post
                        </span>
                      </div>
                    </div>
                    <div className="post-list__item__navbar__column-end__setting__collapse__item">
                      <div className="post-list__item__navbar__column-end__setting__collapse__item--icon">
                        <IconContext.Provider value={{ size: "18px" }}>
                          <MdBlock />
                        </IconContext.Provider>
                      </div>
                      <div className="post-list__item__navbar__column-end__setting__collapse__item--name">
                        <span className="post-list__item__navbar__column-end__setting__collapse__item--name--span">
                          Zablokuj użytkownika
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="post-list__item__content">
              <span className="post-list__item__content--span">
                {post.content}
              </span>
            </div>
            {post.photo !== null && (
              <div className="post-list__item__photo">
                <img
                  src={"/static/images/" + post.photo}
                  alt=""
                  className="post-list__item__photo--img"
                />
              </div>
            )}
            <div className="post-list__item__downbar">
              <DownBarButtons />
            </div>
            <div className="post-list__item__comments">
              <Comments />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostList;

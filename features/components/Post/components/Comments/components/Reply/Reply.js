import React, { useEffect, useRef, useState } from "react";
import { IoIosHeartEmpty } from "react-icons/io";
import { FiVolumeX, FiFlag } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { IconContext } from "react-icons";
import useTranslation from "next-translate/useTranslation";
import SecondaryInput from "../../../../../../common/SecondaryInput/SecondaryInput";

const Reply = ({
  replies = [
    {
      id: 1,
      userId: 123,
      content: "dsadas",
      likes: 15,
    },
  ],
  users = {
    123: {
      id: 123,
      firstName: "Jan",
      lastName: "Kowalski",
      photo: "profile.png",
    },
  },
  focusElement,
  focusIcon,
  handleClick,
}) => {
  const [replyText, setReplyText] = useState("");

  const collapseSetting = useRef(
    [...new Array(replies.length)].map(() => React.createRef())
  );

  const { t } = useTranslation();

  const reportComment = t("component:post.comments.settings.report");
  const muteUser = t("component:post.comments.settings.mute");

  useEffect(() => {
    collapseSetting.current.forEach((item) => {
      const { current: cItem } = item;

      const collapseItem = cItem.querySelector(
        ".post__item__comments__container__item__content__reply__container__item__content__top-bar__icon__collapse"
      );

      cItem.addEventListener("click", () => {
        const { current: fElement } = focusElement;
        const { current: fIcon } = focusIcon;

        if (fElement !== collapseItem && fElement !== null) {
          fElement.classList.add("is-close");
        }

        if (cItem !== fIcon) fIcon?.classList.remove("is-visible");

        cItem.classList.toggle("is-visible");
        collapseItem.classList.toggle("is-close");
        focusElement.current = collapseItem;
        focusIcon.current = cItem;

        window.addEventListener("click", handleClick);
      });
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="post__item__comments__container__item__content__reply__container">
      <div className="post__item__comments__container__item__content__reply__container__input">
        <form
          className="post__item__comments__container__item__content__reply__container__input--form"
          onSubmit={handleSubmit}
        >
          <SecondaryInput
            value={replyText}
            onChange={setReplyText}
            size="small"
          />
        </form>
      </div>
      {replies.map((reply, index) => {
        const user = users[reply.userId];
        return (
          <div
            className="post__item__comments__container__item__content__reply__container__item"
            key={reply.id}
          >
            <div className="post__item__comments__container__item__content__reply__container__item__photo">
              <img
                src={"/static/images/" + user.photo}
                alt=""
                className="post__item__comments__container__item__content__reply__container__item__photo--img"
              />
            </div>
            <div className="post__item__comments__container__item__content__reply__container__item__content">
              <div className="post__item__comments__container__item__content__reply__container__item__content__top-bar">
                <div className="post__item__comments__container__item__content__reply__container__item__content__top-bar__user-name">
                  <span className="post__item__comments__container__item__content__reply__container__item__content__top-bar__user-name--span">
                    {user.firstName + " " + user.lastName}
                  </span>
                </div>
                <div
                  className="post__item__comments__container__item__content__reply__container__item__content__top-bar__icon"
                  ref={collapseSetting.current[index]}
                  onClick={(e) => e.stopPropagation()}
                >
                  <BsThreeDots />
                  <div className="post__item__comments__container__item__content__reply__container__item__content__top-bar__icon__collapse is-close">
                    <div className="post__item__comments__container__item__content__reply__container__item__content__top-bar__icon__collapse__item">
                      <div className="post__item__comments__container__item__content__reply__container__item__content__top-bar__icon__collapse__item--icon">
                        <IconContext.Provider
                          value={{
                            className:
                              "post__item__comments__container__item__content__reply__container__item__content__top-bar__icon__collapse__item--icon--customize",
                          }}
                        >
                          <FiVolumeX />
                        </IconContext.Provider>
                      </div>
                      <div className="post__item__comments__container__item__content__reply__container__item__content__top-bar__icon__collapse__item--name">
                        <span className="post__item__comments__container__item__content__reply__container__item__content__top-bar__icon__collapse__item--name--span">
                          {muteUser}
                        </span>
                      </div>
                    </div>
                    <div className="post__item__comments__container__item__content__reply__container__item__content__top-bar__icon__collapse__item">
                      <div className="post__item__comments__container__item__content__reply__container__item__content__top-bar__icon__collapse__item--icon">
                        <IconContext.Provider
                          value={{
                            className:
                              "post__item__comments__container__item__content__reply__container__item__content__top-bar__icon__collapse__item--icon--customize",
                          }}
                        >
                          <FiFlag />
                        </IconContext.Provider>
                      </div>
                      <div className="post__item__comments__container__item__content__reply__container__item__content__top-bar__icon__collapse__item--name">
                        <span className="post__item__comments__container__item__content__reply__container__item__content__top-bar__icon__collapse__item--name--span">
                          {reportComment}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="post__item__comments__container__item__content__reply__container__item__content__text">
                {reply.content}
              </div>
              <div className="post__item__comments__container__item__content__reply__container__item__content__down-bar">
                <div className="post__item__comments__container__item__content__reply__container__item__content__down-bar--icon hover-pal-color">
                  <IoIosHeartEmpty />
                  <span className="post__item__comments__container__item__content__reply__container__item__content__down-bar--icon--number">
                    {reply.likes}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Reply;

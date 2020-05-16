import React, { useEffect, useRef, useState } from "react";
import { IoIosHeartEmpty } from "react-icons/io";
import { FiMessageCircle, FiVolumeX, FiFlag } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { IconContext } from "react-icons";
import useTranslation from "next-translate/useTranslation";
import Reply from "./components/Reply/Reply";
import SecondaryInput from "../../../../common/SecondaryInput/SecondaryInput";

const Comments = ({
  comments = [
    {
      id: 1,
      userId: 123,
      content: "lorem ipsum lorem",
      likes: 2,
      replies: [{ id: 1, userId: 124, content: "Lorem", likes: 12 }],
    },
    { id: 2, userId: 124, content: "lorem lorem", likes: 5, replies: [] },
  ],
  users = {
    123: {
      id: 123,
      firstName: "Jan",
      lastName: "Kowalski",
      photo: "profile.png",
    },
    124: {
      id: 123,
      firstName: "Krzysiek",
      lastName: "Krakowiaczek",
      photo: "profile.png",
    },
  },
  user = {
    photo: "profile.png",
  },
  focusElement,
}) => {
  const focusIcon = useRef(null);
  const [commentText, setCommentText] = useState("");

  const replies = useRef(
    [...new Array(comments.length)].map(() => React.createRef())
  );
  const collapseSetting = useRef(
    [...new Array(comments.length)].map(() => React.createRef())
  );

  const { t } = useTranslation();

  const reportComment = t("component:post.comments.settings.report");
  const muteUser = t("component:post.comments.settings.mute");

  const handleClick = (e) => {
    const { current: fElement } = focusElement;
    const { current: fIcon } = focusIcon;
    if (!fElement.classList.contains("is-close")) {
      fElement.classList.add("is-close");
      fIcon.classList.remove("is-visible");
    }
    window.removeEventListener("click", handleClick);
  };

  useEffect(() => {
    collapseSetting.current.forEach((item) => {
      const { current: cItem } = item;

      const collapseItem = cItem.querySelector(
        ".post__item__comments__container__item__content__item__top-bar__icon__collapse"
      );

      cItem.addEventListener("click", () => {
        const { current: fElement } = focusElement;
        const { current: fIcon } = focusIcon;

        if (fElement !== collapseItem) fElement?.classList.add("is-close");
        if (cItem !== fIcon) fIcon?.classList.remove("is-visible");

        cItem.classList.toggle("is-visible");
        collapseItem.classList.toggle("is-close");
        focusElement.current = collapseItem;
        focusIcon.current = cItem;

        window.addEventListener("click", handleClick);
      });
    });

    replies.current.forEach((reply) => {
      const { current: cReply } = reply;
      const repliesSection = cReply
        .closest(".post__item__comments__container__item__content")
        .querySelector(
          ".post__item__comments__container__item__content__reply"
        );
      cReply.addEventListener("click", () => {
        repliesSection.classList.toggle("is-close");
      });
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="post__item__comments__container">
      <div className="post__item__comments__container__input">
        <form
          className="post__item__comments__container__input--form"
          onSubmit={handleSubmit}
        >
          <SecondaryInput
            user={user}
            value={commentText}
            onChange={setCommentText}
          />
        </form>
      </div>
      {comments.map((comment, index) => {
        const user = users[comment.userId];
        return (
          <div
            className="post__item__comments__container__item"
            key={comment.id}
          >
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
                    ref={collapseSetting.current[index]}
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
                    <span className="post__item__comments__container__item__content__item__down-bar--icon--amount">
                      {comment.likes}
                    </span>
                  </div>
                  <div
                    className="post__item__comments__container__item__content__item__down-bar--icon hover-primary-color"
                    ref={replies.current[index]}
                  >
                    <FiMessageCircle />
                    <span className="post__item__comments__container__item__content__item__down-bar--icon--amount">
                      {comment.replies.length}
                    </span>
                  </div>
                </div>
              </div>
              <div className="post__item__comments__container__item__content__reply">
                {comment.replies.length === 0 ? null : (
                  <Reply
                    replies={comment.replies}
                    users={users}
                    focusElement={focusElement}
                    focusIcon={focusIcon}
                    handleClick={handleClick}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Comments;

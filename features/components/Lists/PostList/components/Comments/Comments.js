import React from "react";
import { IoIosHeartEmpty } from "react-icons/io";
import { FiMessageCircle } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";

const Comments = ({
  comments = [
    {
      userId: 123,
      content: "lorem ipsum lorem",
      comments: [{ userId: 124, content: "Lorem" }],
    },
    { userId: 124, content: "lorem lorem", comments: [] },
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
}) => {
  return (
    <div className="post-list__item__comments__container">
      {comments.map((comment) => {
        const user = users[comment.userId];
        return (
          <div className="post-list__item__comments__container__item">
            <div className="post-list__item__comments__container__item__photo">
              <img
                src={"/static/images/" + user.photo}
                alt=""
                className="post-list__item__comments__container__item__photo--img"
              />
            </div>
            <div className="post-list__item__comments__container__item__content">
              <div className="post-list__item__comments__container__item__content__top-bar">
                <div className="post-list__item__comments__container__item__content__top-bar__user-name">
                  <span className="post-list__item__comments__container__item__content__top-bar__user-name--span">
                    {user.firstName + " " + user.lastName}
                  </span>
                </div>
                <div className="post-list__item__comments__container__item__content__top-bar__icon"></div>
              </div>
              <div className="post-list__item__comments__container__item__content__text">
                {comment.content}
              </div>
              <div className="post-list__item__comments__container__item__content__down-bar">
                <div className="post-list__item__comments__container__item__content__down-bar--icon hover-pal-color">
                  <IoIosHeartEmpty />
                  <span className="post-list__item__comments__container__item__content__down-bar--icon--amount">
                    123
                  </span>
                </div>
                <div className="post-list__item__comments__container__item__content__down-bar--icon hover-primary-color">
                  <FiMessageCircle />
                  <span className="post-list__item__comments__container__item__content__down-bar--icon--amount">
                    123
                  </span>
                </div>
              </div>
              <div className="post-list__item__comments__container__item__content__reply">
                das
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Comments;

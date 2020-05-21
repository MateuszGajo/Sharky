import React, { useState } from "react";
import cx from "classnames";
import Router from "../features/routes";
import HomeLayout from "../features/components/Layout/Home/HomeLayout";
import "../styles/main.scss";

const notifications = () => {
  const [friends, setFriends] = useState({
    234: {
      id: 234,
      friendShip: "pal",
    },
  });
  const [users, setUsers] = useState({
    234: {
      id: 234,
      firstName: "Janek",
      lastName: "Kowalski",
      photo: "profile.png",
    },
    453: {
      id: 453,
      firstName: "Kowalski",
      lastName: "Piotr",
      photo: "profile.png",
    },
  });
  const [notifications, setNotifications] = useState([
    {
      content: "Opublikował post w",
      userId: 234,
      source: {
        id: 123,
        type: "group",
        name: "ćwikły pomidora",
      },
    },
    {
      content: "Opublikował post w",
      userId: 453,
      source: {
        id: 456,
        type: "group",
        name: "Ananasy",
      },
    },
  ]);
  return (
    <HomeLayout>
      {notifications.map((notification, index) => {
        const user = users[notification.userId];
        const friendShip = friends[notification.userId]?.friendShip;
        return (
          <div
            className="home-wrapper__main__content__notifications"
            key={index}
          >
            <div
              className="home-wrapper__main__content__notifications__item"
              onClick={() =>
                Router.pushRoute(notification.source.type, {
                  id: notification.source.id,
                })
              }
            >
              <div className="home-wrapper__main__content__notifications__item__photo">
                <img
                  src={"/static/images/" + user.photo}
                  alt=""
                  className="home-wrapper__main__content__notifications__item__photo--img"
                />
              </div>
              <div className="home-wrapper__main__content__notifications__item__content">
                <div className="home-wrapper__main__content__notifications__item__content--name">
                  <span
                    className={cx(
                      "home-wrapper__main__content__notifications__item__content--name--span bold-text",
                      {
                        "pal-color": friendShip === "pal",
                        "family-color": friendShip === "family",
                        "friend-color": friendShip === "friend",
                      }
                    )}
                  >
                    {user.firstName + " " + user.lastName}
                  </span>
                </div>
                <div className="home-wrapper__main__content__notifications__item__content--text">
                  <span className="home-wrapper__main__content__notifications__item__content--text--span">
                    {notification.content}
                    <span className="bold-text">
                      {" " + notification.source.name}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </HomeLayout>
  );
};

export default notifications;

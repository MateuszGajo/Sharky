import React, { useState } from "react";
import cx from "classnames";
import Router from "../features/routes";

const Frineds = () => {
  const [users, setUsers] = useState({
    234: {
      id: 234,
      firstName: "Janek",
      lastName: "Kowalski",
      online: false,
      amonutsOfFriends: 20,
    },
    453: {
      id: 453,
      firstName: "Janek",
      lastName: "Kowalski",
      online: false,
      amonutsOfFriends: 20,
    },
    156: {
      id: 156,
      firstName: "Janek",
      lastName: "Kowalski",
      online: false,
      amonutsOfFriends: 20,
    },
  });
  const friendLists = [
    {
      userId: 234,
      relationShip: "Rodzina",
    },
    {
      userId: 453,
      relationShip: "Przyjaciel",
    },
    {
      userId: 156,
      relationShip: "Znajomy",
    },
  ];

  return (
    <div className="home-wrapper__main__content__friends">
      {friendLists.map((friend) => {
        const user = users[friend.userId];
        return (
          <div
            className="home-wrapper__main__content__friends__item"
            key={user.id}
          >
            <div className="home-wrapper__main__content__friends__item--picture">
              <img
                src="/static/images/profile.png"
                className="home-wrapper__main__content__friends__item--picture--img"
                onClick={() => {
                  Router.pushRoute("profile", { id: user.id });
                }}
              />
            </div>
            <div className="home-wrapper__main__content__friends__item__info">
              <div className="home-wrapper__main__content__friends__item__info__first-column">
                <div className="home-wrapper__main__content__friends__item__info__first-column--name">
                  <span
                    className="home-wrapper__main__content__friends__item__info__first-column--name--span"
                    onClick={() => {
                      Router.pushRoute("profile", { id: user.id });
                    }}
                  >
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <div className="home-wrapper__main__content__friends__item__info__first-column--amounts-of-friends">
                  <span className="home-wrapper__main__content__friends__item__info__first-column--amounts-of-friends--span">
                    Liczba znajomych: {user.amonutsOfFriends}
                  </span>
                </div>
              </div>
              <div className="home-wrapper__main__content__friends__item__info__second-column">
                <div className="home-wrapper__main__content__friends__item--status">
                  <div
                    className={cx(
                      "home-wrapper__main__content__friends__item--status--circle",
                      {
                        "primary-background": friend.relationShip === "Znajomy",
                        "family-background": friend.relationShip === "Rodzina",
                        "pal-background": friend.relationShip === "Przyjaciel",
                      }
                    )}
                  >
                    <span>{friend.relationShip}</span>
                  </div>
                  <div className="home-wrapper__main__content__friends__item--status__change-status">
                    <div
                      className={cx(
                        "home-wrapper__main__content__friends__item--status--circle primary-background",
                        {
                          "brightness-reduce hover-brightness":
                            friend.relationShip !== "Znajomy",
                        }
                      )}
                      onClick={() => {
                        if (friend.relationShip !== "Znajomy") {
                          //save to db
                        }
                      }}
                    >
                      <span>Znajomy</span>
                    </div>
                    <div
                      className={cx(
                        "home-wrapper__main__content__friends__item--status--circle pal-background ",
                        {
                          "brightness-reduce hover-brightness":
                            friend.relationShip !== "Przyjaciel",
                        }
                      )}
                      onClick={() => {
                        if (friend.relationShip !== "Przyjaciel") {
                          //save to db
                        }
                      }}
                    >
                      <span>Przyjaciel</span>
                    </div>
                    <div
                      className={cx(
                        "home-wrapper__main__content__friends__item--status--circle family-background ",
                        {
                          "brightness-reduce hover-brightness":
                            friend.relationShip !== "Rodzina",
                        }
                      )}
                      onClick={() => {
                        if (friend.relationShipd !== "Rodzina") {
                          //save to db
                        }
                      }}
                    >
                      <span>Rodzina</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Frineds;

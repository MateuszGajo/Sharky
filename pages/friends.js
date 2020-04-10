import React from "react";
import cx from "classnames";
import Router from "../features/routes";
import HomeLayout from "../features/components/Layout/Home/HomeLayout";
import "./styles/main.scss";

const Frineds = () => {
  const friendLists = [
    {
      firstName: "Janek",
      lastName: "Kowalski",
      online: true,
      amonutsOfFriends: 20,
      bond: "Rodzina",
      id: 1,
    },
    {
      firstName: "Janek",
      lastName: "Kowalski",
      online: false,
      amonutsOfFriends: 20,
      bond: "Przyjaciel",
      id: 2,
    },
    {
      firstName: "Janek",
      lastName: "Kowalski",
      online: false,
      amonutsOfFriends: 20,
      bond: "Znajomy",
      id: 3,
    },
  ];

  return (
    <HomeLayout>
      <div className="home-wrapper__main__content__friends">
        {friendLists.map((friend) => (
          <div
            className="home-wrapper__main__content__friends__item"
            key={friend.id}
          >
            <div className="home-wrapper__main__content__friends__item--picture">
              <img
                src="/static/images/profile.png"
                className="home-wrapper__main__content__friends__item--picture--img"
                onClick={() => {
                  Router.pushRoute("profile", { id: friend.id });
                }}
              />
            </div>
            <div className="home-wrapper__main__content__friends__item__info">
              <div className="home-wrapper__main__content__friends__item__info__first-column">
                <div className="home-wrapper__main__content__friends__item__info__first-column--name">
                  <span
                    className="home-wrapper__main__content__friends__item__info__first-column--name--span"
                    onClick={() => {
                      Router.pushRoute("profile", { id: friend.id });
                    }}
                  >
                    {friend.firstName} {friend.lastName}
                  </span>
                </div>
                <div className="home-wrapper__main__content__friends__item__info__first-column--amounts-of-friends">
                  <span className="home-wrapper__main__content__friends__item__info__first-column--amounts-of-friends--span">
                    Liczba znajomych: {friend.amonutsOfFriends}
                  </span>
                </div>
              </div>
              <div className="home-wrapper__main__content__friends__item__info__second-column">
                <div className="home-wrapper__main__content__friends__item--status">
                  <div
                    className={cx(
                      "home-wrapper__main__content__friends__item--status--circle",
                      {
                        "primary-background": friend.bond === "Znajomy",
                        "blue-background": friend.bond === "Rodzina",
                        "pink-background": friend.bond === "Przyjaciel",
                      }
                    )}
                  >
                    <span>{friend.bond}</span>
                  </div>
                  <div className="home-wrapper__main__content__friends__item--status__change-status">
                    <div
                      className={cx(
                        "home-wrapper__main__content__friends__item--status--circle primary-background",
                        {
                          "brightness-reduce hover-brightness":
                            friend.bond !== "Znajomy",
                        }
                      )}
                      onClick={() => {
                        if (friend.bond !== "Znajomy") {
                          //save to db
                        }
                      }}
                    >
                      <span>Znajomy</span>
                    </div>
                    <div
                      className={cx(
                        "home-wrapper__main__content__friends__item--status--circle pink-background ",
                        {
                          "brightness-reduce hover-brightness":
                            friend.bond !== "Przyjaciel",
                        }
                      )}
                      onClick={() => {
                        if (friend.bond !== "Przyjaciel") {
                          //save to db
                        }
                      }}
                    >
                      <span>Przyjaciel</span>
                    </div>
                    <div
                      className={cx(
                        "home-wrapper__main__content__friends__item--status--circle blue-background ",
                        {
                          "brightness-reduce hover-brightness":
                            friend.bond !== "Rodzina",
                        }
                      )}
                      onClick={() => {
                        if (friend.bond !== "Rodzina") {
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
        ))}
      </div>
    </HomeLayout>
  );
};

export default Frineds;

import React, { useState } from "react";
import NavBar from "../features/components/Layout/Home/Compound/components/NavBar/Navbar";

const profile = () => {
  const [groups, setGroups] = useState([
    {
      id: 123,
      name: "dsasa",
    },
    {
      id: 1233,
      name: "dsassdaa",
    },
    {
      id: 154,
      name: "dsasssa",
    },
  ]);

  const [friends, setFriends] = useState([
    {
      id: 123,
      firstName: "dsa",
      lastName: "sdada",
      photo: "profile.png",
    },
    {
      id: 1213,
      firstName: "dsaa",
      lastName: "sdaasda",
      photo: "profile.png",
    },
    {
      id: 543,
      firstName: "ddasa",
      lastName: "sdadsada",
      photo: "profile.png",
    },
  ]);
  return (
    <section className="profile">
      <NavBar />
      <div className="profile__container">
        <div className="profile__container__person">
          <div className="profile__container__person--name">
            <span className="profile__container__person--name--span">
              Jan Kowalski
            </span>
          </div>
          <div className="profile__container__person--photo">
            <img
              src="/static/images/profile.png"
              alt=""
              className="profile__container__person--photo--img"
            />
          </div>
        </div>
        <div className="profile__container__info">
          <div className="profile__container__info__container">
            <div className="profile__container__info__container__item">
              <div className="profile__container__info__container__item--circle">
                <span className="profile__container__info__container__item--circle--span">
                  234
                </span>
              </div>
              <div className="profile__container__info__container__item--name">
                <span className="profile__container__info__container__item--name--span">
                  Znajomi
                </span>
              </div>
            </div>
            <div className="profile__container__info__container__item">
              <div className="profile__container__info__container__item--circle">
                <span className="profile__container__info__container__item--circle--span">
                  234
                </span>
              </div>
              <div className="profile__container__info__container__item--name">
                <span className="profile__container__info__container__item--name--span">
                  Znajomi
                </span>
              </div>
            </div>
            <div className="profile__container__info__container__item">
              <div className="profile__container__info__container__item--circle">
                <span className="profile__container__info__container__item--circle--span">
                  234
                </span>
              </div>
              <div className="profile__container__info__container__item--name">
                <span className="profile__container__info__container__item--name--span">
                  Znajomi
                </span>
              </div>
            </div>
          </div>
          <div className="profile__container__info__container">
            <div className="profile__container__info__container__item">
              <div className="profile__container__info__container__item--circle">
                <span className="profile__container__info__container__item--circle--span">
                  234
                </span>
              </div>
              <div className="profile__container__info__container__item--name">
                <span className="profile__container__info__container__item--name--span">
                  Znajomi
                </span>
              </div>
            </div>
            <div className="profile__container__info__container__item">
              <div className="profile__container__info__container__item--circle">
                <span className="profile__container__info__container__item--circle--span">
                  234
                </span>
              </div>
              <div className="profile__container__info__container__item--name">
                <span className="profile__container__info__container__item--name--span">
                  Znajomi
                </span>
              </div>
            </div>
            <div className="profile__container__info__container__item">
              <div className="profile__container__info__container__item--circle">
                <span className="profile__container__info__container__item--circle--span">
                  234
                </span>
              </div>
              <div className="profile__container__info__container__item--name">
                <span className="profile__container__info__container__item--name--span">
                  Znajomi
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default profile;

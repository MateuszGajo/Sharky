import React, { useState } from "react";
import { TiInfoLargeOutline } from "react-icons/ti";
import NavBar from "../features/components/Layout/Home/Compound/components/NavBar/Navbar";

const profile = () => {
  const [user, setUser] = useState({
    id: 234,
    firstName: "Janek",
    lastName: "Kowalski",
    photo: "profile.png",
  });

  const [fanpages, setFanPages] = useState([
    {
      id: 1,
      name: "Fanpage Krzycha",
      photo: "profile.png",
    },
  ]);

  const [photos, setPhotos] = useState([
    {
      id: 1,
      name: "profile.png",
    },
  ]);

  const [posts, setPosts] = useState([
    {
      id: 1,
      content: "Cos śmiesznego",
    },
  ]);

  const [groups, setGroups] = useState([
    {
      id: 123,
      name: "dsasa",
      photo: "profile.png",
    },
    {
      id: 1233,
      name: "dsassdaa",
      photo: "profile.png",
    },
    {
      id: 154,
      name: "dsasssa",
      photo: "profile.png",
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
                  {friends.length}
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
                  {groups.length}
                </span>
              </div>
              <div className="profile__container__info__container__item--name">
                <span className="profile__container__info__container__item--name--span">
                  Grupy
                </span>
              </div>
            </div>
            <div className="profile__container__info__container__item">
              <div className="profile__container__info__container__item--circle">
                <span className="profile__container__info__container__item--circle--span">
                  {fanpages.length}
                </span>
              </div>
              <div className="profile__container__info__container__item--name">
                <span className="profile__container__info__container__item--name--span">
                  Fanpage
                </span>
              </div>
            </div>
          </div>
          <div className="profile__container__info__container">
            <div className="profile__container__info__container__item">
              <div className="profile__container__info__container__item--circle">
                <span className="profile__container__info__container__item--circle--span">
                  {photos.length}
                </span>
              </div>
              <div className="profile__container__info__container__item--name">
                <span className="profile__container__info__container__item--name--span">
                  Zdjęcia
                </span>
              </div>
            </div>
            <div className="profile__container__info__container__item">
              <div className="profile__container__info__container__item--circle">
                <span className="profile__container__info__container__item--circle--span">
                  {posts.length}
                </span>
              </div>
              <div className="profile__container__info__container__item--name">
                <span className="profile__container__info__container__item--name--span">
                  Posty
                </span>
              </div>
            </div>
            <div className="profile__container__info__container__item">
              <div className="profile__container__info__container__item--circle">
                <span className="profile__container__info__container__item--circle--span">
                  <span className="profile__container__info__container__item--circle--span--icon">
                    <TiInfoLargeOutline />
                  </span>
                </span>
              </div>
              <div className="profile__container__info__container__item--name">
                <span className="profile__container__info__container__item--name--span">
                  O mnie
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

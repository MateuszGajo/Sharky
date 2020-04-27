import React from "react";
import { TiInfoLargeOutline } from "react-icons/ti";

const ProfileInfo = ({ user, fanpages, groups, friends, posts, photos }) => {
  return (
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
  );
};

export default ProfileInfo;

import React, { useState } from "react";
import { TiInfoLargeOutline } from "react-icons/ti";
import useTranslation from "next-translate/useTranslation";
import ProfileDisplayItems from "../ProfileDisplayItems/ProfileDisplayItems";

const ProfileInfo = ({
  user,
  fanpages,
  groups,
  friends,
  posts,
  photos,
  setChooseItem,
}) => {
  const [isDisplayAbout, setStatusOfDisplayAbout] = useState(false);

  const { t } = useTranslation();

  const aboutItemName = t("profile:about-me");
  const friendsItemName = t("profile:friends");
  const groupsItemName = t("profile:groups");
  const photosItemName = t("profile:photos");
  const postsItemName = t("profile:posts");
  const fanpagesItemName = t("profile:fanpages");
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
      {isDisplayAbout ? (
        <ProfileDisplayItems
          chooseItem={aboutItemName}
          setChooseItem={setStatusOfDisplayAbout}
        />
      ) : (
        <div className="profile__container__info">
          <div className="profile__container__info__container">
            <div
              className="profile__container__info__container__item"
              onClick={() => setChooseItem(friendsItemName)}
            >
              <div className="profile__container__info__container__item--circle">
                <span className="profile__container__info__container__item--circle--span">
                  {friends.length}
                </span>
              </div>
              <div className="profile__container__info__container__item--name">
                <span className="profile__container__info__container__item--name--span">
                  {friendsItemName}
                </span>
              </div>
            </div>
            <div
              className="profile__container__info__container__item"
              onClick={() => setChooseItem(groupsItemName)}
            >
              <div className="profile__container__info__container__item--circle">
                <span className="profile__container__info__container__item--circle--span">
                  {groups.length}
                </span>
              </div>
              <div className="profile__container__info__container__item--name">
                <span className="profile__container__info__container__item--name--span">
                  {groupsItemName}
                </span>
              </div>
            </div>
            <div
              className="profile__container__info__container__item"
              onClick={() => setChooseItem(fanpagesItemName)}
            >
              <div className="profile__container__info__container__item--circle">
                <span className="profile__container__info__container__item--circle--span">
                  {fanpages.length}
                </span>
              </div>
              <div className="profile__container__info__container__item--name">
                <span className="profile__container__info__container__item--name--span">
                  {fanpagesItemName}
                </span>
              </div>
            </div>
          </div>
          <div className="profile__container__info__container">
            <div
              className="profile__container__info__container__item"
              onClick={() => setChooseItem(photosItemName)}
            >
              <div className="profile__container__info__container__item--circle">
                <span className="profile__container__info__container__item--circle--span">
                  {photos.length}
                </span>
              </div>
              <div className="profile__container__info__container__item--name">
                <span className="profile__container__info__container__item--name--span">
                  {photosItemName}
                </span>
              </div>
            </div>
            <div
              className="profile__container__info__container__item"
              onClick={() => setChooseItem(postsItemName)}
            >
              <div className="profile__container__info__container__item--circle">
                <span className="profile__container__info__container__item--circle--span">
                  {posts.length}
                </span>
              </div>
              <div className="profile__container__info__container__item--name">
                <span className="profile__container__info__container__item--name--span">
                  {postsItemName}
                </span>
              </div>
            </div>
            <div
              className="profile__container__info__container__item"
              onClick={() => setStatusOfDisplayAbout(true)}
            >
              <div className="profile__container__info__container__item--circle">
                <span className="profile__container__info__container__item--circle--span">
                  <span className="profile__container__info__container__item--circle--span--icon">
                    <TiInfoLargeOutline />
                  </span>
                </span>
              </div>
              <div className="profile__container__info__container__item--name">
                <span className="profile__container__info__container__item--name--span">
                  {aboutItemName}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;

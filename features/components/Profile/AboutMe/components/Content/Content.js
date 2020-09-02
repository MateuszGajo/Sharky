import React from "react";
import { TiInfoLargeOutline } from "react-icons/ti";
import i18next from "@i18n";
const { useTranslation } = i18next;

const Content = ({
  info,
  numberOfPhotos,
  setChooseItem,
  aboutItemName,
  setStatusOfDisplayAbout,
}) => {
  const { t } = useTranslation();
  const {
    numberOfFriends,
    numberOfGroups,
    numberOfFanpages,
    numberOfPosts,
  } = info;

  const friendsItemName = t("profile:friends");
  const groupsItemName = t("profile:groups");
  const photosItemName = t("profile:photos");
  const postsItemName = t("profile:posts");
  const fanpagesItemName = t("profile:fanpages");

  return (
    <div className="profile__container__info">
      <div className="profile__container__info__container">
        <div
          className="profile__container__info__container__item"
          onClick={() => setChooseItem(friendsItemName)}
        >
          <div className="profile__container__info__container__item--circle">
            <span className="profile__container__info__container__item--circle--span">
              {numberOfFriends}
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
              {numberOfGroups}
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
              {numberOfFanpages}
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
              {numberOfPhotos}
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
              {numberOfPosts}
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
  );
};

export default Content;

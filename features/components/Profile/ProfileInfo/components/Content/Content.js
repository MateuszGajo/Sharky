import React from "react";
import PropTypes from "prop-types";
import { TiInfoLargeOutline } from "react-icons/ti";
import i18next from "~i18n";

const { useTranslation } = i18next;

const Content = ({
  info,
  numberOfPhotos,
  setChooseItem,
  aboutText,
  setStatusOfDisplayAbout,
}) => {
  const { t } = useTranslation();
  const {
    numberOfFriends,
    numberOfGroups,
    numberOfFanpages,
    numberOfPosts,
  } = info;

  const friendsText = t("profile:friends");
  const groupsText = t("profile:groups");
  const photosText = t("profile:photos");
  const postsText = t("profile:posts");
  const fanpagesText = t("profile:fanpages");

  return (
    <div className="profile__container__info">
      <div className="profile__container__info__container">
        <div
          className="profile__container__info__container__item"
          onClick={() => setChooseItem(friendsText)}
          aria-hidden="true"
        >
          <div className="profile__container__info__container__item__circle">
            <span className="profile__container__info__container__item__circle__span">
              {numberOfFriends}
            </span>
          </div>
          <div className="profile__container__info__container__item__name">
            <span className="profile__container__info__container__item__name__span">
              {friendsText}
            </span>
          </div>
        </div>
        <div
          className="profile__container__info__container__item"
          onClick={() => setChooseItem(groupsText)}
          aria-hidden="true"
        >
          <div className="profile__container__info__container__item__circle">
            <span className="profile__container__info__container__item__circle__span">
              {numberOfGroups}
            </span>
          </div>
          <div className="profile__container__info__container__item__name">
            <span className="profile__container__info__container__item__name__span">
              {groupsText}
            </span>
          </div>
        </div>
        <div
          className="profile__container__info__container__item"
          onClick={() => setChooseItem(fanpagesText)}
          aria-hidden="true"
        >
          <div className="profile__container__info__container__item__circle">
            <span className="profile__container__info__container__item__circle__span">
              {numberOfFanpages}
            </span>
          </div>
          <div className="profile__container__info__container__item__name">
            <span className="profile__container__info__container__item__name__span">
              {fanpagesText}
            </span>
          </div>
        </div>
      </div>
      <div className="profile__container__info__container">
        <div
          className="profile__container__info__container__item"
          onClick={() => setChooseItem(photosText)}
          aria-hidden="true"
        >
          <div className="profile__container__info__container__item__circle">
            <span className="profile__container__info__container__item__circle__span">
              {numberOfPhotos}
            </span>
          </div>
          <div className="profile__container__info__container__item__name">
            <span className="profile__container__info__container__item__name__span">
              {photosText}
            </span>
          </div>
        </div>
        <div
          className="profile__container__info__container__item"
          onClick={() => setChooseItem(postsText)}
          aria-hidden="true"
        >
          <div className="profile__container__info__container__item__circle">
            <span className="profile__container__info__container__item__circle__span">
              {numberOfPosts}
            </span>
          </div>
          <div className="profile__container__info__container__item__name">
            <span className="profile__container__info__container__item__name__span">
              {postsText}
            </span>
          </div>
        </div>
        <div
          className="profile__container__info__container__item"
          onClick={() => setStatusOfDisplayAbout(true)}
          aria-hidden="true"
        >
          <div className="profile__container__info__container__item__circle">
            <span className="profile__container__info__container__item__circle__span">
              <span className="profile__container__info__container__item__circle__span__icon">
                <TiInfoLargeOutline />
              </span>
            </span>
          </div>
          <div className="profile__container__info__container__item__name">
            <span className="profile__container__info__container__item__name__span">
              {aboutText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

Content.propTypes = {
  info: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.string,
    birthDate: PropTypes.string,
    numberOfPhotos: PropTypes.number,
    numberOfFriends: PropTypes.number,
    numberOfGroups: PropTypes.number,
    numberOfFanpages: PropTypes.number,
    numberOfPosts: PropTypes.number,
    photo: PropTypes.string,
    relation: PropTypes.string,
  }).isRequired,
  numberOfPhotos: PropTypes.number.isRequired,
  setChooseItem: PropTypes.func.isRequired,
  aboutText: PropTypes.string.isRequired,
  setStatusOfDisplayAbout: PropTypes.func.isRequired,
};

export default Content;

import React, { useState, useContext, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { IoIosAddCircleOutline } from "react-icons/io";
import cx from "classnames";
import axios from "~features/service/Axios";
import AppContex from "~features/context/AppContext";
import i18next from "~i18n";
import AddFriendButton from "~common/Buttons/AddFriendButton/AddFriendButton";
import FriendInvitedButton from "~common/Buttons/FriendInvitedButton/FriendInvitedButton";
import FriendsInvitationButtons from "~common/Buttons/FriendInvitationButtons/FriendInvitationButtons";
import RelationButtons from "~common/Buttons/RelationButtons/RelationButtons";
import getInitialButtonName from "./getInitialButtonName";

const { useTranslation } = i18next;

const Header = ({ info, setNumberOfPhotos, userId }) => {
  const { t } = useTranslation(["component", "profile"]);

  const {
    firstName,
    lastName,
    photo: initialPhoto,
    relation: initialRelation,
  } = info;
  const { setError, owner } = useContext(AppContex);

  const timeToClear = useRef(null);

  const initialButtonName = getInitialButtonName(info, userId);
  const [relation, setRelation] = useState(initialRelation);
  const [buttonName, setButtonName] = useState(initialButtonName);
  const [photo, setPhoto] = useState(initialPhoto);
  const [prompt, setPrompt] = useState();

  const addPhotoText = t("profile:add-photo");
  const photoAddedSuccessfullyText = t("profile:photo-added-successfully");
  const changePhotoText = t("profile:change-photo");

  const clearPrompt = () => {
    timeToClear.current = setTimeout(() => setPrompt(""), 1500);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];

    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      return setError("wrong-file-type");
    }
    if (file.size > 200000) {
      return setError("file-too-large");
    }
    const data = new FormData();
    data.append("file", file);

    return axios
      .post("/user/add/photo", data)
      .then(() => {
        setPrompt(photoAddedSuccessfullyText);
        clearPrompt();
        console.log("halox1?");
        setNumberOfPhotos((prev) => prev + 1);
      })
      .catch(({ response: { data: message } }) => setError(message));
  };

  useEffect(
    () => () => {
      clearTimeout(timeToClear.current);
    },
    []
  );

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      return setError("wrong-file-type");
    }
    if (file.size > 200000) {
      return setError("file-too-large");
    }

    const data = new FormData();
    data.append("file", e.target.files[0]);

    return axios
      .post("/user/change/photo", data)
      .then(({ data: { fileName } }) => {
        setPhoto(fileName);
        console.log("halo?!");
        setNumberOfPhotos((prev) => prev + 1);
      })
      .catch(({ response: { data: message } }) => setError(message));
  };

  const buttons = {
    green: {
      name: "friend",
      title: t("component:lists.people.friend"),
    },
    pink: {
      name: "pal",
      title: t("component:lists.people.pal"),
    },
    blue: {
      name: "family",
      title: t("component:lists.people.family"),
    },
  };

  const renderComponent = (name) => {
    switch (name) {
      case "add":
        return (
          <AddFriendButton userId={userId} setButtonName={setButtonName} />
        );
      case "invitation":
        return <FriendInvitedButton />;
      case "friendRequest":
        return (
          <FriendsInvitationButtons
            userId={userId}
            setButtonName={setButtonName}
            setCurrentRelation={setRelation}
          />
        );
      case "relation":
        return (
          <RelationButtons
            buttons={buttons}
            userId={userId}
            setButtonName={setButtonName}
            title={relation}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div className="profile__container__person">
      <div className="profile__container__person__name">
        <span className="profile__container__person__name__span">
          {`${firstName} ${lastName}`}
        </span>
      </div>
      <div className="profile__container__person__photo">
        <div
          className={cx("profile__container__person__photo__container", {
            "profile__container__person__photo__container--owner":
              owner.id === userId,
          })}
        >
          <img
            src={`/static/images/${photo}`}
            alt=""
            className="profile__container__person__photo__container__img"
          />
          <div className="profile__container__person__photo__overlay">
            <label htmlFor="profile-change">
              <div className="profile__container__person__photo__overlay__button">
                {changePhotoText}
              </div>
            </label>
            <input
              type="file"
              name="file"
              id="profile-change"
              onChange={handlePhotoChange}
            />
          </div>
        </div>

        {owner.id === userId ? (
          <div className="profile__container__person__add-photo">
            {prompt ? (
              <div className="profile__container__person__add-photo__text">
                {prompt}
              </div>
            ) : (
              <>
                <div className="profile__container__person__add-photo__title">
                  <span className="profile__container__person__add-photo__title__text">
                    {addPhotoText}
                  </span>
                </div>
                <div className="profile__container__person__add-photo__icon">
                  <label
                    htmlFor="file-upload"
                    className="profile__container__person__add-photo__icon__label"
                  >
                    <IoIosAddCircleOutline />
                  </label>

                  <input
                    type="file"
                    name="file"
                    id="file-upload"
                    className="profile__container__person__add-photo__icon__upload__file"
                    onChange={handlePhotoUpload}
                  />
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="profile__container__person__friend">
            {renderComponent(buttonName)}
          </div>
        )}
      </div>
    </div>
  );
};

Header.propTypes = {
  info: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.string,
    birthDate: PropTypes.string,
    numberOfPhotos: PropTypes.number,
    photo: PropTypes.string,
    relation: PropTypes.string,
  }).isRequired,
  setNumberOfPhotos: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};

export default Header;

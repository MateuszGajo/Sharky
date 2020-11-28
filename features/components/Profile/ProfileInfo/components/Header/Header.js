import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "@features/service/Axios";
import { IoIosAddCircleOutline } from "react-icons/io";
import cx from "classnames";
import AppContex from "@features/context/AppContext";
import i18next from "@i18n";
import AddFriendButton from "@common/Buttons/AddFriendButton/AddFriendButton";
import FriendInvitedButton from "@common/Buttons/FriendInvitedButton/FriendInvitedButton";
import FriendsInvitationButtons from "@common/Buttons/FriendsInvitationButtons/FriendsInvitationButtons";
import RelationButtons from "@common/Buttons/RelationButtons/RelationButtons";
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

    if (file.type != "image/png" && file.type != "image/jpeg") {
      return setError("wrong-file-type");
    }
    if (file.size > 200000) {
      return setError("file-too-large");
    }
    const data = new FormData();
    data.append("file", file);

    axios
      .post("/user/add/photo", data)
      .then(() => {
        setPrompt(photoAddedSuccessfullyText);
        clearPrompt();
        setNumberOfPhotos((prev) => prev + 1);
      })
      .catch(({ response: { data: message } }) => setError(message));
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeToClear.current);
    };
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file.type != "image/png" && file.type != "image/jpeg") {
      return setError("wrong-file-type");
    }
    if (file.size > 200000) {
      return setError("file-too-large");
    }

    const data = new FormData();
    data.append("file", e.target.files[0]);

    axios
      .post("/user/change/photo", data)
      .then(({ data: { fileName } }) => {
        setPhoto(fileName);
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
    }
  };
  return (
    <div className="profile__container__person">
      <div className="profile__container__person__name">
        <span className="profile__container__person__name__span">
          {firstName + " " + lastName}
        </span>
      </div>
      <div className="profile__container__person__photo">
        <div
          className={cx("profile__container__person__photo__container", {
            "profile__container__person__photo__container--owner":
              owner.id == userId,
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

        {owner.id == userId ? (
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

export default Header;

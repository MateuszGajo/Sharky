import React, { useState, useContext } from "react";
import axios from "axios";
import { IoIosAddCircleOutline } from "react-icons/io";
import cx from "classnames";
import Spinner from "@components/Spinner/Spinner";
import AppContex from "@features/context/AppContext";
import i18next from "@i18n";
const { useTranslation } = i18next;

const Header = ({ info, setNumberOfPhotos, idUser }) => {
  const { t } = useTranslation();

  const { firstName, lastName, photo: initialPhoto } = info;
  const { setError, owner } = useContext(AppContex);

  const [photo, setPhoto] = useState(initialPhoto);
  const [uploadPhotoPrompt, setUploadPhotoPrompt] = useState();

  const addPhoto = t("profile:add-photo");
  const photoAddedSuccessfully = t("profile:photo-added-successfully");
  const changePhoto = t("profile:change-photo");

  const phototextTimeOut = () => {
    setTimeout(() => setUploadPhotoPrompt(""), 1500);
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
        setUploadPhotoPrompt(photoAddedSuccessfully);
        phototextTimeOut();
        setNumberOfPhotos((prev) => prev + 1);
      })
      .catch(({ response: { data: message } }) => setError(message));
  };

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

  return (
    <div className="profile__container__person">
      <div className="profile__container__person__name">
        <span className="profile__container__person__name--span">
          {firstName + " " + lastName}
        </span>
      </div>
      <div
        className={cx("profile__container__person__photo", {
          "profile__container__person__photo--owner": owner.id == idUser,
        })}
      >
        <img
          src={`/static/images/${photo}`}
          alt=""
          className="profile__container__person__photo--img"
        />
        <div className="profile__container__person__photo__overlay">
          <label htmlFor="profile-change">
            <div className="profile__container__person__photo__overlay__button">
              {changePhoto}
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
      {owner.id == idUser && (
        <div className="profile__container__person__add-photo">
          {uploadPhotoPrompt ? (
            <div className="profile__container__person__add-photo__text">
              {uploadPhotoPrompt}
            </div>
          ) : (
            <>
              <div className="profile__container__person__add-photo__title">
                <span className="profile__container__person__add-photo__title--text">
                  {addPhoto}
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
                  className="profile__container__person__add-photo__icon__upload--file"
                  onChange={handlePhotoUpload}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;

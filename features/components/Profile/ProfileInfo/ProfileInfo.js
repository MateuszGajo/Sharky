import React, { useState } from "react";
import PropTypes from "prop-types";
import DisplayItem from "../DisplayItem/DisplayItem";
import Header from "./components/Header/Header";
import Content from "./components/Content/Content";
import i18next from "@i18n";

const { useTranslation } = i18next;

const ProfileInfo = ({ setChooseItem, info, userId }) => {
  const { numberOfPhotos: initialNumberOfPhotos } = info;

  const [isDisplayAbout, setStatusOfDisplayAbout] = useState(false);

  const [numberOfPhotos, setNumberOfPhotos] = useState(initialNumberOfPhotos);

  const { t } = useTranslation(["profile"]);

  const aboutText = t("profile:about-me");

  return (
    <div className="profile__container">
      <Header
        info={info}
        setNumberOfPhotos={setNumberOfPhotos}
        userId={userId}
      />
      {isDisplayAbout ? (
        <DisplayItem
          chooseItem={aboutText}
          setChooseItem={setStatusOfDisplayAbout}
          info={info}
          userId={userId}
        />
      ) : (
        <Content
          info={info}
          numberOfPhotos={numberOfPhotos}
          setChooseItem={setChooseItem}
          aboutText={aboutText}
          setStatusOfDisplayAbout={setStatusOfDisplayAbout}
        />
      )}
    </div>
  );
};

ProfileInfo.propTypes = {
  setChooseItem: PropTypes.func,
  info: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.string,
    birthDate: PropTypes.string,
  }),
  userId: PropTypes.number,
};

export default ProfileInfo;

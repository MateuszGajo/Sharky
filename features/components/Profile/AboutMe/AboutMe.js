import React, { useState } from "react";
import DisplayItem from "../DisplayItem/DisplayItem";
import Header from "./components/Header/Header";
import Content from "./components/Content/Content";
import i18next from "@i18n";

const { useTranslation } = i18next;

const ProfileInfo = ({ setChooseItem, info, idUser }) => {
  const { numberOfPhotos: initialNumberOfPhotos } = info;

  const [isDisplayAbout, setStatusOfDisplayAbout] = useState(false);

  const [numberOfPhotos, setNumberOfPhotos] = useState(
    Number(initialNumberOfPhotos)
  );

  const { t } = useTranslation(["profile"]);

  const aboutItemName = t("profile:about-me");

  return (
    <div className="profile__container">
      <Header
        info={info}
        setNumberOfPhotos={setNumberOfPhotos}
        idUser={idUser}
      />
      {isDisplayAbout ? (
        <DisplayItem
          chooseItem={aboutItemName}
          setChooseItem={setStatusOfDisplayAbout}
          info={info}
          idUser={idUser}
        />
      ) : (
        <Content
          info={info}
          numberOfPhotos={numberOfPhotos}
          setChooseItem={setChooseItem}
          aboutItemName={aboutItemName}
          setStatusOfDisplayAbout={setStatusOfDisplayAbout}
        />
      )}
    </div>
  );
};

export default ProfileInfo;

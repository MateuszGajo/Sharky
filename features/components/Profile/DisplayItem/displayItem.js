import React from "react";
import { IoMdArrowBack } from "react-icons/io";
import cx from "classnames";
import Fanpages from "@components/Lists/Fanpages/Fanpages";
import People from "@components/Lists/People/People";
import Groups from "@components/Lists/Groups/Groups";
import Photos from "@components/Lists/Photos/Photos";
import Posts from "@components/Lists/Posts/Posts";
import About from "../About/About";
import i18next from "@i18n";
const { useTranslation } = i18next;

const ProfileDisplayItems = ({ setChooseItem, chooseItem, info, idUser }) => {
  const { t } = useTranslation(["profile"]);

  const aboutItemName = t("profile:about-me");
  const friendsItemName = t("profile:friends");
  const groupsItemName = t("profile:groups");
  const photosItemName = t("profile:photos");
  const postsItemName = t("profile:posts");
  const fanpagesItemName = t("profile:fanpages");

  const renderComponent = (name) => {
    switch (name) {
      case fanpagesItemName:
        return <Fanpages />;
      case friendsItemName:
        return <People idUser={idUser} />;
      case groupsItemName:
        return <Groups idUser={idUser} />;
      case photosItemName:
        return <Photos />;
      case postsItemName:
        return <Posts idUser={idUser} />;
      case aboutItemName:
        return <About info={info} />;
    }
  };
  return (
    <div
      className={cx("profile__display", {
        "primary-border-left": chooseItem === aboutItemName,
      })}
    >
      <div className="profile__display__navbar">
        <div
          className="profile__display__navbar--icon"
          onClick={() => setChooseItem("")}
        >
          <IoMdArrowBack />
        </div>
        <div className="profile__display__navbar--name">{chooseItem}</div>
      </div>
      <div
        className={cx("profile__display__content", {
          "profile__display__content--photos": chooseItem === photosItemName,
          "profile__display__content--posts": chooseItem === postsItemName,
          "profile__display__content--about": chooseItem == aboutItemName,
        })}
      >
        {renderComponent(chooseItem)}
      </div>
    </div>
  );
};

export default ProfileDisplayItems;

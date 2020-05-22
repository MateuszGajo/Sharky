import React from "react";
import { IoMdArrowBack } from "react-icons/io";
import cx from "classnames";
import useTranslation from "next-translate/useTranslation";
import Fanpages from "../../Lists/Fanpages/Fanpages";
import People from "../../Lists/People/People";
import Groups from "../../Lists/Groups/Groups";
import Photos from "../../Lists/Photos/Photos";
import Posts from "../../Lists/Posts/Posts";
import About from "../About/About";

const ProfileDisplayItems = ({ setChooseItem, chooseItem }) => {
  const { t } = useTranslation();

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
        return <People />;
      case groupsItemName:
        return <Groups />;
      case photosItemName:
        return <Photos />;
      case postsItemName:
        return <Posts />;
      case aboutItemName:
        return <About />;
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

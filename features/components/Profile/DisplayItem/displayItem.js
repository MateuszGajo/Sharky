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

const ProfileDisplayItems = ({ setChooseItem, chooseItem, info, userId }) => {
  const { t } = useTranslation(["profile"]);

  const aboutText = t("profile:about-me");
  const friendsText = t("profile:friends");
  const groupsText = t("profile:groups");
  const photosText = t("profile:photos");
  const postsText = t("profile:posts");
  const fanpagesText = t("profile:fanpages");

  const renderComponent = (name) => {
    switch (name) {
      case fanpagesText:
        return (
          <Fanpages
            userId={userId}
            onlySubscribed={true}
            helpInformation={false}
          />
        );
      case friendsText:
        return (
          <People userId={userId} onlyFriends={true} helpInformation={false} />
        );
      case groupsText:
        return (
          <Groups
            userId={userId}
            onlySubscribed={true}
            helpInformation={false}
          />
        );
      case photosText:
        return <Photos userId={userId} />;
      case postsText:
        return <Posts userId={userId} authorPost={true} />;
      case aboutText:
        return <About info={info} />;
    }
  };
  return (
    <div
      className={cx("profile__display", {
        "primary-border-left": chooseItem === aboutText,
      })}
    >
      <div className="profile__display__navbar">
        <div
          className="profile__display__navbar__icon"
          onClick={() => setChooseItem("")}
        >
          <IoMdArrowBack />
        </div>
        <div className="profile__display__navbar--name">{chooseItem}</div>
      </div>
      <div
        className={cx("profile__display__content", {
          "profile__display__content--photos": chooseItem === photosText,
          "profile__display__content--posts": chooseItem === postsText,
          "profile__display__content--about": chooseItem == aboutText,
        })}
      >
        {renderComponent(chooseItem)}
      </div>
    </div>
  );
};

export default ProfileDisplayItems;

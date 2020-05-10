import React from "react";
import { IoMdArrowBack } from "react-icons/io";
import cx from "classnames";
import Fanpages from "../../Lists/Fanpages/Fanpages";
import People from "../../Lists/People/People";
import Groups from "../../Lists/Groups/Groups";
import Photos from "../../Lists/Photos/Photos";
import Posts from "../../Lists/Posts/Posts";
import About from "../../About/About";

const ProfileDisplayItems = ({ setChooseItem, chooseItem }) => {
  const renderComponent = (name) => {
    switch (name.toLowerCase()) {
      case "polubione fanpage":
        return <Fanpages />;
      case "znajomi":
        return <People />;
      case "grupy":
        return <Groups />;
      case "zdjęcia":
        return <Photos />;
      case "posty":
        return <Posts />;
      case "o mnie":
        return <About />;
    }
  };
  return (
    <div
      className={cx("profile__display", {
        "primary-border-left": chooseItem.toLowerCase() === "o mnie",
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
          "profile__display__content--center":
            chooseItem.toLowerCase() === "zdjęcia" || "posty",
        })}
      >
        {renderComponent(chooseItem)}
      </div>
    </div>
  );
};

export default ProfileDisplayItems;

import React from "react";
import { IoMdArrowBack } from "react-icons/io";
import cx from "classnames";
import FanpageList from "../../Lists/FanpageList/FanpageList";
import FriendsList from "../../Lists/FriendsList/FriendList";
import GroupList from "../../Lists/GroupList/GroupList";
import PhotoList from "../../Lists/PhotoList/PhotoList";
import PostList from "../../Lists/PostList/PostList";
import About from "../../About/About";

const ProfileDisplayItems = ({ setChooseItem, chooseItem }) => {
  const renderComponent = (name) => {
    switch (name.toLowerCase()) {
      case "polubione fanpage":
        return <FanpageList />;
      case "znajomi":
        return <FriendsList />;
      case "grupy":
        return <GroupList />;
      case "zdjęcia":
        return <PhotoList />;
      case "posty":
        return <PostList />;
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
      <div className="profile__display__content">
        {renderComponent(chooseItem)}
      </div>
    </div>
  );
};

export default ProfileDisplayItems;

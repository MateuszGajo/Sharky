import React from "react";
import { IoMdArrowBack } from "react-icons/io";
import FanpageList from "../../Lists/FanpageList/FanpageList";
import FriendsList from "../../Lists/FriendsList/FriendList";
import GroupList from "../../Lists/GroupList/GroupList";
import PhotoList from "../../Lists/PhotoList/PhotoList";
import PostList from "../../Lists/PostList/PostList";

const ProfileDisplayItems = ({ name = "grupy" }) => {
  const renderComponent = (name) => {
    switch (name.toLowerCase()) {
      case "polubione fanpage":
        return <FanpageList />;
      case "znajomi":
        return <FriendsList />;
      case "grupy":
        return <GroupList />;
      case "zdjecia":
        return <PhotoList />;
      case "posty":
        return <PostList />;
    }
  };
  return (
    <div className="profile__display">
      <div className="profile__display__navbar">
        <div className="profile__display__navbar--icon">
          <IoMdArrowBack />
        </div>
        <div className="profile__display__navbar--name">{name}</div>
      </div>
      <div className="profile__display__content">{renderComponent(name)}</div>
    </div>
  );
};

export default ProfileDisplayItems;

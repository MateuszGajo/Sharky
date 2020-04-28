import React, { useState } from "react";
import FriendList from "../features/components/Lists/FriendsList/FriendList";

const Friends = () => {
  const [users, setUsers] = useState({
    234: {
      id: 234,
      firstName: "Janek",
      lastName: "Kowalski",
      photo: "profile.png",
      online: false,
      amonutsOfFriends: 20,
    },
    453: {
      id: 453,
      firstName: "Janek",
      lastName: "Kowalski",
      online: false,
      photo: "profile.png",
      amonutsOfFriends: 20,
    },
    156: {
      id: 156,
      firstName: "Janek",
      lastName: "Kowalski",
      online: false,
      photo: "profile.png",
      amonutsOfFriends: 20,
    },
  });
  const friendLists = [
    {
      userId: 234,
      relationShip: "rodzina",
    },
    {
      userId: 453,
      relationShip: "przyjaciel",
    },
    {
      userId: 156,
      relationShip: "znajomy",
    },
  ];

  return (
    <div className="home-wrapper__main__content__friends">
      <FriendList listOfFriends={friendLists} users={users} />
    </div>
  );
};

export default Friends;

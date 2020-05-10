import React, { useState } from "react";
import People from "../features/components/Lists/People/People";
import "./styles/main.scss";

const Friends = () => {
  const [users, setUsers] = useState({
    234: {
      id: 234,
      firstName: "Janek",
      lastName: "Kowalski",
      photo: "profile.png",
      online: false,
      numberOfFriends: 20,
    },
    453: {
      id: 453,
      firstName: "Janek",
      lastName: "Kowalski",
      online: false,
      photo: "profile.png",
      numberOfFriends: 20,
    },
    156: {
      id: 156,
      firstName: "Janek",
      lastName: "Kowalski",
      online: false,
      photo: "profile.png",
      numberOfFriends: 20,
    },
  });
  const friendLists = [
    {
      userId: 234,
      relation: "Rodzina",
    },
    {
      userId: 453,
      relation: "Przyjaciel",
    },
    {
      userId: 156,
      relation: "Znajomy",
    },
  ];

  return (
    <div className="home-wrapper__main__content__friends">
      <People listOfPeople={friendLists} users={users} />
    </div>
  );
};

export default Friends;

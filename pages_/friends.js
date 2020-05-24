import React, { useState } from "react";
import HomeLayout from "../features/components/Layout/Home/HomeLayout";
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
      relation: "family",
    },
    {
      userId: 453,
      relation: "pal",
    },
    {
      userId: 156,
      relation: "friend",
    },
  ];

  return (
    <HomeLayout>
      <div className="home-wrapper__main__content__friends">
        <People listOfPeople={friendLists} users={users} />
      </div>
    </HomeLayout>
  );
};

export default Friends;

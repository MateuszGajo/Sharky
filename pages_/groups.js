import React, { useState } from "react";
import HomeLayout from "../features/components/Layout/Home/HomeLayout";
import ListOfGroups from "../features/components/Lists/Groups/Groups";
import "../styles/main.scss";

const Groups = () => {
  const [listOfGroups, setListOfGroups] = useState([
    {
      id: 12,
      name: "dsa",
      photo: "profile.png",
      numberOfMembers: 123,
    },
    {
      id: 12,
      name: "dsa",
      photo: "profile.png",
      numberOfMembers: 123,
    },
    {
      id: 12,
      name: "dsa",
      photo: "profile.png",
      numberOfMembers: 123,
    },
  ]);
  return (
    <HomeLayout>
      <div className="home-wrapper__main__content__groups">
        <ListOfGroups listOfGroupst={listOfGroups} />
      </div>
    </HomeLayout>
  );
};

export default Groups;

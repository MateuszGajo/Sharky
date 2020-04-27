import React, { useState } from "react";
import NavBar from "../features/components/Layout/Home/Compound/components/NavBar/Navbar";
import ProfileInfo from "../features/components/Profile/ProfileInfo/ProfileInfo";
import ProfileDisplayItems from "../features/components/Profile/ProfileDisplayItems/ProfileDisplayItems";

const profile = () => {
  const [isDisplayItem, setStatusOfDisplayItem] = useState(true);
  const [user, setUser] = useState({
    id: 234,
    firstName: "Janek",
    lastName: "Kowalski",
    photo: "profile.png",
  });

  const [fanpages, setFanPages] = useState([
    {
      id: 1,
      name: "Fanpage Krzycha",
      photo: "profile.png",
    },
  ]);

  const [photos, setPhotos] = useState([
    {
      id: 1,
      name: "profile.png",
    },
  ]);

  const [posts, setPosts] = useState([
    {
      id: 1,
      content: "Cos śmiesznego",
    },
  ]);

  const [groups, setGroups] = useState([
    {
      id: 123,
      name: "dsasa",
      photo: "profile.png",
    },
    {
      id: 1233,
      name: "dsassdaa",
      photo: "profile.png",
    },
    {
      id: 154,
      name: "dsasssa",
      photo: "profile.png",
    },
  ]);

  const [friends, setFriends] = useState([
    {
      id: 123,
      firstName: "dsa",
      lastName: "sdada",
      photo: "profile.png",
    },
    {
      id: 1213,
      firstName: "dsaa",
      lastName: "sdaasda",
      photo: "profile.png",
    },
    {
      id: 543,
      firstName: "ddasa",
      lastName: "sdadsada",
      photo: "profile.png",
    },
  ]);
  return (
    <section className="profile">
      <NavBar />
      {isDisplayItem ? (
        <ProfileDisplayItems />
      ) : (
        <ProfileInfo
          user={user}
          fanpages={fanpages}
          groups={groups}
          friends={friends}
          posts={posts}
          photos={photos}
        />
      )}
    </section>
  );
};

export default profile;

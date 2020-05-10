import React, { useState } from "react";
import HomeLayout from "../features/components/Layout/Home/HomeLayout";
import MessageBox from "../features/common/MessageBox/MessageBox";
import Posts from "../features/components/Lists/Posts/Posts";
import "./styles/main.scss";

const Home = () => {
  const [postText, setPostText] = useState("");
  const [users, setUsers] = useState({
    234: {
      id: 234,
      firstName: "Janek",
      lastName: "Kowalski",
      photo: "profile.png",
    },
    453: {
      id: 453,
      firstName: "Janek",
      lastName: "Kowalski",
      photo: "profile.png",
    },
  });
  const [posts, setPosts] = useState([
    {
      userId: 234,
      content: "lorem lorem ala lorem",
      comments: 12,
      likes: [123, 545, 23],
      shares: 18,
    },
    {
      userId: 453,
      content: "lorem lorem ala lorem dasd",
      comments: 122,
      likes: [543, 563, 232],
      shares: 181,
    },
  ]);
  return (
    <HomeLayout>
      <MessageBox btnSize="small" value={postText} onChange={setPostText} />
      <Posts />
    </HomeLayout>
  );
};

export default Home;

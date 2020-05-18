import React, { useState } from "react";
import Router from "../features/routes";
import { FiMessageCircle } from "react-icons/fi";
import { AiOutlineShareAlt } from "react-icons/ai";
import { IoIosHeartEmpty } from "react-icons/io";
import cx from "classnames";
import HomeLayout from "../features/components/Layout/Home/HomeLayout";
import MessageBox from "../features/common/MessageBox/MessageBox";
import Post from "../features/components/Post/Post";
import "../styles/main.scss";

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
      id: 1,
      userId: 234,
      content: "lorem lorem ala lorem",
      comments: 12,
      likes: [123, 545, 23],
      shares: 18,
      date: new Date("2019-03-25"),
      photo: "profile.png",
    },
    {
      id: 2,
      userId: 453,
      content: "lorem lorem ala lorem dasd",
      comments: 122,
      likes: [543, 563, 232],
      shares: 181,
      date: new Date("2019-03-25"),
      photo: "profile.png",
    },
  ]);
  return (
    <HomeLayout>
      <MessageBox btnSize="small" value={postText} onChange={setPostText} />
      <section className="home-page">
        {posts.map((post, index) => {
          let isLiked = post.likes.indexOf(123) !== -1;
          const user = users[post.userId];
          return (
            <div className="home-page__post">
              <Post post={post} user={user} singlePost={false} key={post.id} />
            </div>
          );
        })}
      </section>
    </HomeLayout>
  );
};

export default Home;

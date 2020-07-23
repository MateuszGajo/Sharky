import React, { useState, useEffect } from "react";
import HomeLayout from "@components/Layout/Home/HomeLayout";
import MessageBox from "@common/MessageBox/MessageBox";
import i18next from "@i18n";
import Posts from "@components/Lists/Posts/Posts";
import "../styles/main.scss";
const { useTranslation } = i18next;

const Home = () => {
  const [content, setContent] = useState("");
  const [newPost, setNewPost] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    setNewPost({ content, photo: "profile.png" });
  };

  return (
    <HomeLayout>
      <form onSubmit={handleSubmit}>
        <MessageBox btnSize="small" value={content} onChange={setContent} />
      </form>
      <section className="home-page">
        <Posts newPost={newPost} />
      </section>
    </HomeLayout>
  );
};

export default Home;

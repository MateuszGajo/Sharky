import React, { useState, useEffect } from "react";
import HomeLayout from "@components/Layout/Home/HomeLayout";
import MessageBox from "@common/MessageBox/MessageBox";
import i18next from "@i18n";
import Posts from "@components/Lists/Posts/Posts";
import "../styles/main.scss";
const { useTranslation } = i18next;

const Home = () => {
  const [postText, setPostText] = useState("");

  return (
    <HomeLayout>
      <form onSubmit={handleSubmit}>
        <MessageBox btnSize="small" value={postText} onChange={setPostText} />
      </form>
      <section className="home-page">
        <Posts />
      </section>
    </HomeLayout>
  );
};

export default Home;

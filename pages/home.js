import React, { useState, useEffect, useContext } from "react";
import Router from "next/router";
import HomeLayout from "@components/Layout/Home/HomeLayout";
import MessageBox from "@common/MessageBox/MessageBox";
import Spinner from "@components/Spinner/Spinner";
import Posts from "@components/Lists/Posts/Posts";
import PopUpHandlers from "@components/PopUpHandlers/PopUpHandlers";
import AppContext from "@features/context/AppContext";
import { getOwner } from "@features/service/Functions/index";
import "../styles/home.scss";

const Home = () => {
  const { setOwner } = useContext(AppContext);
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [newPost, setNewPost] = useState();
  const [isAuth, setStatusOfAuth] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setNewPost({ content, file, setContent, setFile });
  };

  useEffect(() => {
    getOwner({ setStatusOfAuth, setOwner });
  }, []);

  if (isAuth == null) return <Spinner />;
  else if (!isAuth) {
    Router.push("/signin");
    return <Spinner />;
  }

  return (
    <HomeLayout>
      <PopUpHandlers />
      <form onSubmit={handleSubmit}>
        <MessageBox
          btnSize="small"
          value={content}
          onChange={setContent}
          file={file}
          setFile={setFile}
        />
      </form>
      <section className="home-page">
        <Posts newPost={newPost} />
      </section>
    </HomeLayout>
  );
};

export default Home;

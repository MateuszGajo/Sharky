import React, { useState, useEffect, useContext } from "react";
import Router from "next/router";
import HomeLayout from "@components/Layout/Home/HomeLayout";
import MessageBox from "@common/MessageBox/MessageBox";
import Spinner from "@components/Spinner/Spinner";
import Posts from "@components/Lists/Posts/Posts";
import AppContext from "@features/context/AppContext";
import { getOwner } from "@features/service/Functions/index";
import "../styles/main.scss";

const Home = () => {
  const { setOwner, isAuth, setStatusOfAuth } = useContext(AppContext);
  const [content, setContent] = useState("");
  const [file, setFile] = useState("");
  const [newPost, setNewPost] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    setNewPost({ content, file });
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

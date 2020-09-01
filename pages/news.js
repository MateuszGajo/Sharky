import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Router from "next/router";
import HomeLayout from "@components/Layout/Home/HomeLayout";
import MessageBox from "@common/MessageBox/MessageBox";
import Posts from "@components/Lists/Posts/Posts";
import Spinner from "@components/Spinner/Spinner";
import { MdBlock } from "react-icons/md";
import i18next from "@i18n";
import { getOwner } from "@features/service/Functions/index";
import AppContext from "@features/context/AppContext";
import "../styles/main.scss";
const { useTranslation } = i18next;

const News = () => {
  const { t } = useTranslation(["news"]);

  const { setOwner, isAuth, setStatusOfAuth } = useContext(AppContext);

  const [permission, setPermission] = useState();
  const [file, setFile] = useState();
  const [content, setContent] = useState("");
  const [newPost, setNewPost] = useState();

  const noPermission = t("news:no-permission");

  const handleSubmit = (e) => {
    e.preventDefault();
    setNewPost({ content, file });
  };
  useEffect(() => {
    isAuth &&
      axios.get("/news/permission").then(({ data: { permission } }) => {
        console.log(permission);
        setPermission(permission);
      });
  }, [isAuth]);

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
      <section className="news">
        {permission ? (
          <form class="news__form" onSubmit={handleSubmit}>
            <MessageBox
              btnSize="small"
              value={content}
              onChange={setContent}
              file={file}
              setFile={setFile}
            />
          </form>
        ) : (
          <div className="news__info">
            <div className="news__info--icon">
              <MdBlock />
            </div>
            <span className="news__info--span">{noPermission}</span>
          </div>
        )}
        <Posts news={true} newPost={newPost} />
      </section>
    </HomeLayout>
  );
};

export default News;

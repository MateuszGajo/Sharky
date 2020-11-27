import React, { useState, useEffect, useContext } from "react";
import axios from "@features/service/Axios";
import Router from "next/router";
import { MdBlock } from "react-icons/md";
import HomeLayout from "@components/Layout/Home/HomeLayout";
import MessageBox from "@common/MessageBox/MessageBox";
import Posts from "@components/Lists/Posts/Posts";
import Spinner from "@components/Spinner/Spinner";
import PopUpHandlers from "@components/PopUpHandlers/PopUpHandlers";
import i18next from "@i18n";
import { getOwner } from "@features/service/Functions/index";
import AppContext from "@features/context/AppContext";
import "../styles/news.scss";
const { useTranslation } = i18next;

const News = () => {
  const { t } = useTranslation(["news"]);

  const { setOwner } = useContext(AppContext);

  const [permission, setPermission] = useState();
  const [file, setFile] = useState();
  const [content, setContent] = useState("");
  const [newPost, setNewPost] = useState();
  const [isAuth, setStatusOfAuth] = useState(null);

  const noPermission = t("news:no-permission");

  const handleSubmit = (e) => {
    e.preventDefault();
    setNewPost({ content, setContent, file, setFile });
  };
  useEffect(() => {
    isAuth &&
      axios.get("/news/permission").then(({ data: { permission } }) => {
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
      <PopUpHandlers />
      <section className="news">
        {permission ? (
          <form className="news__form" onSubmit={handleSubmit}>
            <MessageBox
              btnSize="small"
              value={content}
              onChange={setContent}
              file={file}
              setFile={setFile}
              news={true}
            />
          </form>
        ) : (
          <div className="news__info">
            <div className="news__info__icon">
              <MdBlock />
            </div>
            <span className="news__info__span">{noPermission}</span>
          </div>
        )}
        <Posts news={true} newPost={newPost} />
      </section>
    </HomeLayout>
  );
};

export default News;

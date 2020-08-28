import React, { useState, useEffect } from "react";
import axios from "axios";
import HomeLayout from "@components/Layout/Home/HomeLayout";
import MessageBox from "@common/MessageBox/MessageBox";
import Posts from "@components/Lists/Posts/Posts";
import { MdBlock } from "react-icons/md";
import i18next from "@i18n";
import "../styles/main.scss";
const { useTranslation } = i18next;

const News = ({
  news = [
    {
      id: 1,
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus perferendis nesciunt corporis quidem aut non culpa perspiciatis, esse pariatur voluptate dicta illo nostrum magnam ea sint dolorem officia tempora cum.",
      userId: 123,
      photo: null,
      date: new Date("2012-03-25"),
    },
  ],
  users = {
    123: {
      userId: 123,
      firstName: "Jan",
      lastName: "Kowalski",
      photo: "profile.png",
    },
  },
}) => {
  const { t } = useTranslation(["news"]);
  const [permission, setPermission] = useState();

  const noPermission = t("news:no-permission");
  useEffect(() => {
    axios.get("/news/permission").then(({ data: { permission } }) => {
      console.log(permission);
      setPermission(permission);
    });
  }, []);
  return (
    <section className="news">
      <HomeLayout>
        {permission ? (
          <div className="news__message-box">
            <MessageBox btnSize="small" />
          </div>
        ) : (
          <div className="news__info">
            <div className="news__info--icon">
              <MdBlock />
            </div>
            <span className="news__info--span">{noPermission}</span>
          </div>
        )}
        <Posts posts={news} users={users} />
      </HomeLayout>
    </section>
  );
};

export default News;

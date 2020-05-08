import React from "react";
import HomeLayout from "../features/components/Layout/Home/HomeLayout";
import MessageBox from "../features/common/MessageBox/MessageBox";
import PostList from "../features/components/Lists/PostList/PostList";
import { MdBlock } from "react-icons/md";

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
  const permission = false;
  return (
    <section className="news">
      <HomeLayout>
        {permission ? (
          <MessageBox btnSize="small" />
        ) : (
          <div className="news__info">
            <div className="news__info--icon">
              <MdBlock />
            </div>
            <span className="news__info--span">
              Nie masz uprawnień do zamieszczania postów tej sekcji
            </span>
          </div>
        )}
        <PostList posts={news} users={users} />
      </HomeLayout>
    </section>
  );
};

export default News;

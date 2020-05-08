import React from "react";
import HomeLayout from "../features/components/Layout/Home/HomeLayout";
import MessageBox from "../features/common/MesssageBox/MessageBox";
import PostList from "../features/components/Lists/PostList/PostList";

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
  return (
    <section className="news">
      <HomeLayout>
        <MessageBox btnSize="small" />
        <PostList posts={news} user={users} />
      </HomeLayout>
    </section>
  );
};

export default News;

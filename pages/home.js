import React, { useState } from "react";
import Router from "../features/routes";
import { FaUserCircle } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { AiOutlineShareAlt } from "react-icons/ai";
import { IoIosHeartEmpty } from "react-icons/io";
import HomeLayout from "../features/components/Layout/Home/HomeLayout";
import "./styles/home.scss";

const Home = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      firstName: "Kamil",
      lastName: "Latnikowski",
      content: "lorem lorem ala lorem",
      comments: 12,
      likes: 55,
      shares: 18,
    },
    {
      id: 1,
      firstName: "Kamilaa",
      lastName: "Latnikowskiaaa",
      content: "lorem lorem ala lorem dasd",
      comments: 122,
      likes: 551,
      shares: 181,
    },
  ]);
  return (
    <HomeLayout addingPost={true} search={true}>
      {posts.map((post) => {
        return (
          <div
            className="home-wrapper__main__content__post"
            onClick={() => {
              // Router.pushRoute("post", { postId: post.id });
            }}
          >
            <div className="home-wrapper__main__content__post_body">
              <div className="home-wrapper__main__content__post_body__picture">
                <FaUserCircle />
              </div>
              <div className="home-wrapper__main__content__post_body__text">
                <div className="home-wrapper__main__content__post_body__text__author">
                  <span className="home-wrapper__main__content__post_body__text__author--span">
                    {post.firstName} {post.lastName}
                  </span>
                </div>
                <div className="home-wrapper__main__content__post_body__text__content">
                  {post.content}
                </div>
              </div>
            </div>
            <div className="home-wrapper__main__content__post__icons">
              <div className="home-wrapper__main__content__post__icons__icon transition-color hover-primary-color">
                <FiMessageCircle />
                <p className="home-wrapper__main__content__post__icons__icon--amount">
                  {post.comments}
                </p>
              </div>
              <div
                className="home-wrapper__main__content__post__icons__icon transition-color hover-pink-color"
                onClick={() => {
                  //save to database
                }}
              >
                <IoIosHeartEmpty />
                <p className="home-wrapper__main__content__post__icons__icon--amount">
                  {post.likes}
                </p>
              </div>
              <div className="home-wrapper__main__content__post__icons__icon transition-color hover-blue-color">
                <AiOutlineShareAlt />
                <p className="home-wrapper__main__content__post__icons__icon--amount">
                  {post.shares}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </HomeLayout>
  );
};

export default Home;

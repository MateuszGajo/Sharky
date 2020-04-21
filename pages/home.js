import React, { useState } from "react";
import Router from "../features/routes";
import { FaUserCircle } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { AiOutlineShareAlt } from "react-icons/ai";
import { IoIosHeartEmpty } from "react-icons/io";
import cx from "classnames";
import HomeLayout from "../features/components/Layout/Home/HomeLayout";
import MessageBox from "../features/common/MesssageBox/MessageBox";
import "./styles/main.scss";

const Home = () => {
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([
    {
      id: 1,
      firstName: "Kamil",
      lastName: "Latnikowski",
      content: "lorem lorem ala lorem",
      comments: 12,
      likes: [123, 545, 23],
      shares: 18,
    },
    {
      id: 1,
      firstName: "Kamilaa",
      lastName: "Latnikowskiaaa",
      content: "lorem lorem ala lorem dasd",
      comments: 122,
      likes: [543, 563, 232],
      shares: 181,
    },
  ]);
  return (
    <HomeLayout>
      <MessageBox btnSize="small" value={postText} onChange={setPostText} />
      {posts.map((post) => {
        let isLiked = post.likes.indexOf(123) !== -1;
        return (
          <div
            className="home-wrapper__main__content__post"
            onClick={() => {
              Router.pushRoute("post", { postId: post.id });
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
              <div className="home-wrapper__main__content__post__icons__icon  hover-primary-color">
                <FiMessageCircle />
                <p className="home-wrapper__main__content__post__icons__icon--amount">
                  {post.comments}
                </p>
              </div>
              <div
                className={cx(
                  "home-wrapper__main__content__post__icons__icon  hover-pal-color",
                  {
                    "pal-color": isLiked,
                  }
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isLiked) {
                    console.log("zapisuje do bazy");
                  }
                }}
              >
                <IoIosHeartEmpty />
                <p className="home-wrapper__main__content__post__icons__icon--amount">
                  {post.likes.length}
                </p>
              </div>
              <div
                className="home-wrapper__main__content__post__icons__icon  hover-family-color"
                onClick={(e) => e.stopPropagation()}
              >
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

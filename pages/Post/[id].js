import React, { useState, useEffect, useContext, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import HomeLayout from "@components/Layout/Home/HomeLayout";
import SinglePost from "@components/Post/Post";
import withWizzard from "@components/Post/withWizzard";
import Spinner from "@components/Spinner/Spinner";
import WizzardContext from "@components/Post/context/WizzardContext";
import "../../styles/main.scss";

const Post = () => {
  const router = useRouter();
  const idPost = router.query.id;

  const { posts, setPosts, users, setUsers } = useContext(WizzardContext);

  const getUsers = async (idUsers) => {
    await axios
      .post("/user/get", { idUsers })
      .then(({ data: { users: u } }) => {
        let usersKey = {};

        for (let i = 0; i < u.length; i++) {
          const { id, firstName, lastName, photo } = u[i];
          usersKey[id] = {
            id,
            firstName,
            lastName,
            photo,
          };
        }

        setUsers({ ...users, ...usersKey });
      });
  };

  useEffect(() => {
    idPost &&
      axios
        .post("/post/get/single", { idPost })
        .then(async ({ data: { post, comments, isMoreComments } }) => {
          console.log(isMoreComments);
          const idUsers = [];
          for (let i = 0; i < comments.length; i++) {
            idUsers.push(comments[i].idUser);
          }
          idUsers.push(post.idUser);
          await getUsers(idUsers);
          setPosts([{ ...post, comments, isMoreComments }]);
        });
  }, [idPost]);
  const focusElement = useRef(null);

  if (!posts.length) return <Spinner />;

  return (
    <HomeLayout>
      <section className="post">
        {posts.map((post) => (
          <SinglePost
            post={post}
            user={users[post.idUser]}
            userShare={null}
            focusElement={focusElement}
            single={true}
          />
        ))}
      </section>
    </HomeLayout>
  );
};

export default withWizzard(Post);

import React, { useState, useEffect, useContext, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import HomeLayout from "@components/Layout/Home/HomeLayout";
import SinglePost from "@components/Post/Post";
import withWizzard from "@components/Post/withWizzard";
import Spinner from "@components/Spinner/Spinner";
import WizzardContext from "@components/Post/context/WizzardContext";
import AppContext from "@features/context/AppContext";
import { getOwner } from "@features/service/Functions/index";
import i18next from "@i18n";
import "../../styles/post.scss";
const { useTranslation } = i18next;

const Post = () => {
  const router = useRouter();
  const idPost = router.query.id;
  const { t } = useTranslation(["post"]);

  const { posts, setPosts, users, setUsers } = useContext(WizzardContext);
  const { setOwner } = useContext(AppContext);
  const [postError, setPostError] = useState("");
  const [isAuth, setStatusOfAuth] = useState(null);

  const [isLoading, setStutusOfLoading] = useState(true);

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
      isAuth &&
      axios
        .post("/post/get/single", { idPost })
        .then(async ({ data: { post, comments, isMoreComments } }) => {
          const idUsers = [];
          for (let i = 0; i < comments.length; i++) {
            idUsers.push(comments[i].idUser);
          }
          idUsers.push(post.idUser);
          await getUsers(idUsers);
          setPosts([{ ...post, comments, isMoreComments }]);
          setStutusOfLoading(false);
        })
        .catch(({ response: { status, data: message } }) => {
          if (status == 404 || status == 403) {
            setPostError(message);
            setStutusOfLoading(false);
          }
        });
  }, [idPost, isAuth]);
  const focusElement = useRef(null);

  useEffect(() => {
    getOwner({ setStatusOfAuth, setOwner });
  }, []);

  if (isAuth == null) return <Spinner />;
  else if (!isAuth) {
    router.push("/signin");
    return <Spinner />;
  } else if (isLoading) return <Spinner />;

  return (
    <HomeLayout>
      <section className="post">
        {postError && (
          <div className="post_error">{t(`post:error.${postError}`)}</div>
        )}
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

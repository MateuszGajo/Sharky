import React, { useEffect, useState } from "react";
import i18next from "../i18n";
import Spinner from "../features/components/Spinner/Spinner";
import Post from "../features/components/Post/Post";
import { getPosts } from "../features/components/Post/services/Functions/index";
import "../styles/main.scss";

const Index = () => {
  const [initialized, setInitialized] = useState(false);
  const [isMoreComment, setStatusOfMoreComments] = useState();
  const [isMorePosts, setStatusOfMorePosts] = useState();

  const [users, setUsers] = useState({
    1: {
      id: 1,
      firstName: "Janek",
      lastName: "Kowalski",
      photo: "profile.png",
      idLiked: null,
    },
  });
  const [posts, setPosts] = useState([
    {
      id: "21sd",
      idPost: 1,
      idUser: 1,
      idLike: 1,
      idUserShare: 1,
      idShare: null,
      numberOfShares: 2,
      numberOfComments: 5,
      numberOfLikes: 6,
      isMoreComments: true,
      content: "dasdsa",
      date: new Date("2019-03-25"),
      photo: "profile.png",
      comments: [
        {
          id: 1,
          idUser: 1,
          likes: 20,
          content: "ble",
          numberOfReplies: 1,
          numberOfLikes: 5,
        },
        {
          id: 2,
          idUser: 1,
          likes: 20,
          content: "ble",
          numberOfReplies: 2,
          numberOfLikes: 2,
        },
      ],
    },
  ]);
  useEffect(() => {
    i18next.initPromise.then((resp) => setInitialized(true));
    getPosts({
      posts,
      setPosts,
      from: 0,
      users,
      setUsers,
      setStatusOfMorePosts,
      setStatusOfMoreComments,
    });
  }, []);
  if (!initialized) return <Spinner />;
  return (
    <>
      {console.log(posts)}
      {posts.map((post) => (
        <Post post={post} users={users} setUsers={setUsers} key={post.id} />
      ))}
    </>
  );
};

export default Index;

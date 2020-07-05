import React, { useContext, useEffect, useRef } from "react";
import Post from "../../Post/Post";
import withPosts from "./withPosts";
import WizzardContext from "../../Post/context/WizzardContext";
import { getPosts } from "../../Post/services/Functions/index";
import { getOwner } from "../../../service/Functions/index";

const PostList = ({}) => {
  const {
    posts,
    setPosts,
    users,
    setUsers,
    setStatusOfMoreComments,
    setStatusOfMorePosts,
    muteUser,
    owner,
    setOwner,
  } = useContext(WizzardContext);

  useEffect(() => {
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

  useEffect(() => {
    if (muteUser.idUser !== null) {
      const newPosts = posts?.filter((post) => {
        const idUser = post.idUserShare || post.idUser;

        return muteUser.idUser != idUser;
      });
      setPosts(newPosts);
    }
  }, [muteUser]);

  const focusElement = useRef(null);
  return (
    <div className="post-list">
      {posts.map((post) => {
        return (
          <div className="post-list__post" key={post.id}>
            <Post
              post={post}
              user={users[post.idUser]}
              userShare={users[post.idUserShare]}
              focusElement={focusElement}
              single={false}
            />
          </div>
        );
      })}
    </div>
  );
};

export default withPosts(PostList);

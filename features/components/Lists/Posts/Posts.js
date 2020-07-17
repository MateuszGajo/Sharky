import React, { useContext, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "@components/Post/Post";
import Spinner from "@components/Spinner/Spinner";
import withWizzard from "@components/Post/withWizzard";
import WizzardContext from "@components/Post/context/WizzardContext";
import { getPosts } from "@components/Post/services/functions/index";
import i18next from "@i18n";

const { useTranslation } = i18next;

const PostList = ({}) => {
  const { t } = useTranslation(["component"]);
  const endOfContent = t("component:lists.posts.end-of-content");

  const {
    posts,
    setPosts,
    users,
    setUsers,
    setStatusOfMoreComments,
    setStatusOfMorePosts,
    muteUser,
    isMorePosts,
  } = useContext(WizzardContext);

  const getNewPosts = () => {
    getPosts({
      posts,
      setPosts,
      from: posts.length,
      users,
      setUsers,
      setStatusOfMorePosts,
      setStatusOfMoreComments,
    });
  };

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

  if (posts.length == 0) return <Spinner />;

  return (
    <div className="post-list">
      <InfiniteScroll
        dataLength={posts.length}
        next={() => getNewPosts()}
        hasMore={isMorePosts}
        loader={<Spinner />}
        endMessage={
          <p className="post-list__end-of-content">
            <b>{endOfContent}</b>
          </p>
        }
      >
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
      </InfiniteScroll>
    </div>
  );
};

export default withWizzard(PostList);

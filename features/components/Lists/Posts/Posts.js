import React, { useContext, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "@components/Post/Post";
import Spinner from "@components/Spinner/Spinner";
import withWizzard from "@components/Post/withWizzard";
import WizzardContext from "@components/Post/context/WizzardContext";
import { getPosts } from "@components/Post/services/Functions";
import i18next from "@i18n";

const { useTranslation } = i18next;

const PostList = ({
  idFanpage = null,
  idGroup = null,
  news = false,
  authorPost = false,
  idUser = null,
}) => {
  const { t } = useTranslation(["component"]);
  const endOfContent = t("component:lists.posts.end-of-content");
  const noContent = t("component:lists.posts.no-content");
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

  const fetchData = (from) => {
    getPosts({
      idFanpage,
      idGroup,
      news,
      authorPost,
      idUser,
      posts,
      setPosts,
      from,
      users,
      setUsers,
      setStatusOfMorePosts,
      setStatusOfMoreComments,
    });
  };

  useEffect(() => {
    fetchData(0);
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
      {console.log(posts)}
      <InfiniteScroll
        dataLength={posts.length}
        next={() => fetchData(posts.length)}
        hasMore={isMorePosts}
        loader={<Spinner />}
        endMessage={
          <p className="post-list__end-of-content">
            <b>{posts.length ? endOfContent : noContent}</b>
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

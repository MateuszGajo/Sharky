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
  fanpageId = null,
  groupId = null,
  news = false,
  authorPost = false,
  userId = null,
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
      fanpageId,
      groupId,
      news,
      authorPost,
      userId,
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
    if (muteUser.userId !== null) {
      const newPosts = posts?.filter((post) => {
        const userId = post.postSharedUserId || post.userId;

        return muteUser.userId != userId;
      });
      setPosts(newPosts);
    }
  }, [muteUser]);

  const focusElement = useRef(null);

  return (
    <div className="post-list">
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
                user={users[post.userId]}
                userShare={users[post.postSharedUserId]}
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

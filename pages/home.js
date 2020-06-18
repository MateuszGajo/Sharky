import React, { useState, useEffect } from "react";
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';
import HomeLayout from "../features/components/Layout/Home/HomeLayout";
import MessageBox from "../features/common/MessageBox/MessageBox";
import Post from "../features/components/Post/Post";
import Spinner from "../features/components/Spinner/Spinner";
import i18next from '../i18n';
import "../styles/main.scss";
const { useTranslation } = i18next;



const Home = () => {
  const { t } = useTranslation(["home"])

  const [postText, setPostText] = useState("");
  const [addedPosts, setAddedPosts] = useState([]);
  const [isMoreData, setStatusOfMoreData] = useState(true);
  const [user, setUser] = useState({});
  const [users, setUsers] = useState({});
  const [posts, setPosts] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const date = new Date();
    axios
      .post("/post/add", {
        content: postText,
        date: date,
        photo: "profile.png",
      })
      .then(({ data }) => {
        if (data.success) {
          setUser(data.user);
          setAddedPosts([
            {
              id: data.postId,
              userId: data.user.id,
              content: postText,
              date,
              photo: "profile.png",
            },
            ...addedPosts,
          ]);
        }
      })
      .catch((err) => console.log(err.response));
  };

  const getPostsUsers = async (posts) => {
    console.log(posts)
    const usersId = [];
    for (let i = 0; i < posts.length; i++) {
      const { id_user } = posts[i];
      if (users[id_user] === undefined) usersId.push(id_user);
    }
    if (usersId.length > 0)
      await axios
        .post("/user/get", {
          usersId,
        })
        .then(({ data }) => { setUsers({ ...users, ...data }); console.log("wykonałem") })
        .catch((err) => console.log(err));
  };

  const getPosts = (from) => {
    axios
      .post("/post/get", { from })
      .then(async ({ data }) => {
        await getPostsUsers(data);
        if (data.length < 20) setStatusOfMoreData(false)
        setPosts([...posts, ...data])
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getPosts(0);
  }, []);
  return (
    <HomeLayout>
      <form onSubmit={handleSubmit}>
        <MessageBox btnSize="small" value={postText} onChange={setPostText} />
      </form>
      <section className="home-page">
        {addedPosts.map((post) => (
          <div className="home-page__post">
            <Post post={post} user={user} isComment={true} key={post.id} />
          </div>
        ))}
        <InfiniteScroll
          dataLength={posts.length}
          next={() => getPosts(posts.length)}
          hasMore={isMoreData}
          style={{ overflow: "hidden" }}
          loader={<Spinner style={{ position: "absolute" }} />}
          endMessage={
            <p className="home-page__end-of-content">
              <b>{t("home:end-of-content")}</b>
            </p>
          }>
          {posts.map((post, index) => {

            const user = users[post.userId];
            return (
              <div className="home-page__post">
                <Post post={post} user={user} singlePost={false} />
              </div>
            );
          })}
        </InfiniteScroll>

      </section>
    </HomeLayout>
  );
};

export default Home;

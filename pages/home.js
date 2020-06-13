import React, { useState } from "react";
import HomeLayout from "../features/components/Layout/Home/HomeLayout";
import MessageBox from "../features/common/MessageBox/MessageBox";
import Post from "../features/components/Post/Post";
import axios from "axios";
import "../styles/main.scss";

const Home = () => {
  const [postText, setPostText] = useState("");
  const [addedPosts, setAddedPosts] = useState([]);
  const [user, setUser] = useState({});
  const [users, setUsers] = useState({
    234: {
      id: 234,
      firstName: "Janek",
      lastName: "Kowalski",
      photo: "profile.png",
    },
    453: {
      id: 453,
      firstName: "Janek",
      lastName: "Kowalski",
      photo: "profile.png",
    },
  });
  const [posts, setPosts] = useState([
    {
      id: 1,
      userId: 234,
      content: "lorem lorem ala lorem",
      comments: 12,
      likes: [123, 545, 23],
      shares: 18,
      date: new Date("2019-03-25"),
      photo: "profile.png",
    },
    {
      id: 2,
      userId: 453,
      content: "lorem lorem ala lorem dasd",
      comments: 122,
      likes: [543, 563, 232],
      shares: 181,
      date: new Date("2019-03-25"),
      photo: "profile.png",
    },
  ]);

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
          console.log("success", data);
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
  return (
    <HomeLayout>
      <form onSubmit={handleSubmit}>
        <MessageBox btnSize="small" value={postText} onChange={setPostText} />
      </form>
      <section className="home-page">
        {console.log(addedPosts)}
        {addedPosts.map((post) => (
          <div className="home-page__post">
            <Post post={post} user={user} isComment={true} key={post.id} />
          </div>
        ))}
        {posts.map((post, index) => {
          let isLiked = post.likes.indexOf(123) !== -1;
          const user = users[post.userId];
          return (
            <div className="home-page__post">
              <Post post={post} user={user} singlePost={false} key={post.id} />
            </div>
          );
        })}
      </section>
    </HomeLayout>
  );
};

export default Home;

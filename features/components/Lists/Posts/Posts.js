import React, { useRef } from "react";
import Post from "../../Post/Post";

const PostList = ({
  posts = [
    {
      id: 1,
      userId: 123,
      content: "dasdsa",
      date: new Date("2019-03-25"),
      photo: "profile.png",
    },
    {
      id: 2,
      userId: 123,
      content: "dasdsa",
      date: new Date("2015-03-25"),
      photo: null,
    },
  ],
  users = {
    123: {
      id: 123,
      firstName: "Jan",
      lastName: "Kowalski",
      photo: "profile.png",
    },
  },
}) => {
  const focusElement = useRef(null);
  return (
    <div className="post-list">
      {posts.map((post) => {
        const user = users[post.userId];
        return (
          <Post
            post={post}
            user={user}
            key={post.id}
            focusElement={focusElement}
          />
        );
      })}
    </div>
  );
};

export default PostList;

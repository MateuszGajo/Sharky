import React from "react";
import HomeLayout from "../features/components/Layout/Home/HomeLayout";
import SinglePost from "../features/components/Post/Post";

const Post = () => {
  return (
    <HomeLayout>
      <div className="post">
        <SinglePost />
      </div>
    </HomeLayout>
  );
};

export default Post;

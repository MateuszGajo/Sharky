import React from "react";
import MessageBox from "../../../common/MessageBox/MessageBox";
import Posts from "../../Lists/Posts/Posts";

const Home = () => {
  return (
    <div className="group-home">
      <MessageBox btnSize="small" />
      <div className="group-home__posts">
        <Posts />
      </div>
    </div>
  );
};

export default Home;

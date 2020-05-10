import React from "react";
import MessageBox from "../../../common/MessageBox/MessageBox";
import Posts from "../../Lists/Posts/Posts";

const Home = () => {
  return (
    <div className="group-home">
      <MessageBox />
      <Posts />
    </div>
  );
};

export default Home;

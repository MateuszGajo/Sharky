import React from "react";
import WizzardContext from "@components/Post/context/WizzardContext";
import Posts from "../../Lists/Posts/Posts";

const Home = () => {
  return (
    <div className="fanpage-home">
      <Posts />
    </div>
  );
};

export default Home;

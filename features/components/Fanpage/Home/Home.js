import React from "react";
import WizzardContext from "@components/Post/context/WizzardContext";
import Posts from "../../Lists/Posts/Posts";

const Home = ({ idFanpage }) => {
  return (
    <div className="fanpage-home">
      {idFanpage && <Posts idFanpage={idFanpage} />}
    </div>
  );
};

export default Home;

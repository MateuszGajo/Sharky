import React from "react";
import Posts from "@components/Lists/Posts/Posts";

const Home = ({ idFanpage }) => {
  return (
    <div className="fanpage-home">
      {idFanpage && <Posts idFanpage={idFanpage} />}
    </div>
  );
};

export default Home;

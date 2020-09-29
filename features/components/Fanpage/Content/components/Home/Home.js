import React from "react";
import Posts from "@components/Lists/Posts/Posts";

const Home = ({ fanpageId }) => {
  return (
    <div className="fanpage-home">
      {fanpageId && <Posts fanpageId={fanpageId} />}
    </div>
  );
};

export default Home;

import React from "react";
import MessageBox from "../../../common/MessageBox/MessageBox";
import Posts from "../../Lists/Posts/Posts";

const Home = ({ idGroup }) => {
  return (
    <div className="group-home">
      <MessageBox btnSize="small" />
      <div className="group-home__posts">
        {idGroup && <Posts idGroup={idGroup} />}
      </div>
    </div>
  );
};

export default Home;

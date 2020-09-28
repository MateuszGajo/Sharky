import React from "react";
import MessageBox from "@common/MessageBox/MessageBox";
import Posts from "@components/Lists/Posts/Posts";

const Home = ({ groupId }) => {
  return (
    <div className="group-home">
      <MessageBox btnSize="small" />
      <div className="group-home__posts">
        {groupId && <Posts groupId={groupId} />}
      </div>
    </div>
  );
};

export default Home;

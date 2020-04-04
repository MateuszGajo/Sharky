import React from "react";
import * as HomeLayoutCompound from "./Compound/HomeLayoutCompound";

const HomeLayout = ({ children, search = false, addingPost = false }) => {
  return (
    <HomeLayoutCompound.Wizzard>
      <HomeLayoutCompound.NavBar />
      <HomeLayoutCompound.Main
        search={search}
        addingPost={addingPost}
        children={children}
      />
      <HomeLayoutCompound.FriendsBar />
      <HomeLayoutCompound.Message />
    </HomeLayoutCompound.Wizzard>
  );
};

export default HomeLayout;

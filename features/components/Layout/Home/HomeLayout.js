import React from "react";
import * as HomeLayoutCompound from "./Compound/HomeLayoutCompound";

const HomeLayout = ({ children }) => {
  return (
    <HomeLayoutCompound.Wizzard>
      <HomeLayoutCompound.NavBar />
      <HomeLayoutCompound.Main children={children} />
      <HomeLayoutCompound.FriendsBar />
      <HomeLayoutCompound.Messager />
    </HomeLayoutCompound.Wizzard>
  );
};

export default HomeLayout;

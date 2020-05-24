import React from "react";
import * as HomeLayoutCompound from "./Compound/HomeLayoutCompound";

const HomeLayout = ({ children }) => {
  return (
    <HomeLayoutCompound.Wizzard>
      <HomeLayoutCompound.Wrapper>
        <HomeLayoutCompound.NavBar />
        <HomeLayoutCompound.Main children={children} />
        <HomeLayoutCompound.FriendsBar />
        <HomeLayoutCompound.Messager />
      </HomeLayoutCompound.Wrapper>
    </HomeLayoutCompound.Wizzard>
  );
};

export default HomeLayout;

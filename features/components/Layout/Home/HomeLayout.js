import React from "react";
import PropTypes from "prop-types";
import * as HomeLayoutCompound from "./Compound/HomeLayoutCompound";

const HomeLayout = ({ children }) => (
  <HomeLayoutCompound.Wizzard>
    <HomeLayoutCompound.Wrapper>
      <HomeLayoutCompound.NavBar />
      <HomeLayoutCompound.Main>{children}</HomeLayoutCompound.Main>
      <HomeLayoutCompound.FriendsBar />
      <HomeLayoutCompound.Messager />
    </HomeLayoutCompound.Wrapper>
  </HomeLayoutCompound.Wizzard>
);
HomeLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

export default HomeLayout;

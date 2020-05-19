import React from "react";
import "../styles/main.scss";
import HomeLayout from "../features/components/Layout/Home/HomeLayout";
import Fanpages from "../features/components/Lists/Fanpages/Fanpages";
import Groups from "../features/components/Lists/Groups/Groups";
import People from "../features/components/Lists/People/People";
import Posts from "../features/components/Lists/Posts/Posts";

const Index = () => {
  return (
    <HomeLayout>
      <Posts />
    </HomeLayout>
  );
};
export default Index;

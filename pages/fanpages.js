import React from "react";
import HomeLayout from "../features/components/Layout/Home/HomeLayout";
import ListOfFanpages from "../features/components/Lists/Fanpages/Fanpages";
import "./styles/main.scss";

const Fanpages = () => {
  return (
    <HomeLayout>
      <div className="home-wrapper__main__content__fanpages">
        <ListOfFanpages />
      </div>
    </HomeLayout>
  );
};

export default Fanpages;

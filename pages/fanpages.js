import React from "react";
import HomeLayout from "../features/components/Layout/Home/HomeLayout";
import FanpageList from "../features/components/Lists/FanpageList/FanpageList";
import "./styles/main.scss";

const Fanpages = () => {
  return (
    <HomeLayout>
      <div className="home-wrapper__main__content__fanpages">
        <FanpageList />
      </div>
    </HomeLayout>
  );
};

export default Fanpages;

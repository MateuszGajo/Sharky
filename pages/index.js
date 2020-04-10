import React from "react";
import Frineds from "./friends";
import HomeLayout from "../features/components/Layout/Home/HomeLayout";
import "./styles/main.scss";

const Index = () => {
  return (
    <HomeLayout>
      <Frineds />
    </HomeLayout>
  );
};
export default Index;

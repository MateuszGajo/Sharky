import React from "react";
<<<<<<< HEAD
<<<<<<< HEAD
import SignIn from "./signin";
import SignUp from "./signup";
const Index = () => {
  return <SignUp />;
=======
import Home from "./home";
const Index = () => {
  return <Home />;
>>>>>>> features/home
=======
import Frineds from "./friends";
import HomeLayout from "../features/components/Layout/Home/HomeLayout";
import "./styles/main.scss";

const Index = () => {
  return (
    <HomeLayout>
      <Frineds />
    </HomeLayout>
  );
>>>>>>> features/friends
};
export default Index;

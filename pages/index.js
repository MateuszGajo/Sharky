import React, { useState, useEffect, useContext } from "react";
import Router from "next/router";
import HomeLayout from "@components/Layout/Home/HomeLayout";
import MessageBox from "@common/MessageBox/MessageBox";
import Spinner from "@components/Spinner/Spinner";
import Posts from "@components/Lists/Posts/Posts";
import AppContext from "@features/context/AppContext";
import { getOwner } from "@features/service/Functions/index";
import People from "@components/Lists/People/People";
import "../styles/main.scss";

const Index = () => {
  const { setOwner, isAuth, setStatusOfAuth } = useContext(AppContext);

  useEffect(() => {
    getOwner({ setStatusOfAuth, setOwner });
  }, []);

  if (isAuth == null) return <Spinner />;
  else if (!isAuth) {
    Router.push("/signin");
    return <Spinner />;
  }

  return (
    <HomeLayout>
      <People idUser={1} />
    </HomeLayout>
  );
};

export default Index;

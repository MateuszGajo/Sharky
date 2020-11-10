import React, { useState, useEffect, useContext } from "react";
import Router from "next/router";
import Spinner from "@components/Spinner/Spinner";
import AppContext from "@features/context/AppContext";
import { getOwner } from "@features/service/Functions/index";
import Posts from "@components/Lists/Posts/Posts";
import PopUpHandlers from "@components/PopUpHandlers/PopUpHandlers";
import HomeLayout from "@components/Layout/Home/HomeLayout";
import "../styles/main.scss";

const Index = () => {
  const { setOwner } = useContext(AppContext);
  const [isAuth, setStatusOfAuth] = useState(null);

  useEffect(() => {
    getOwner({ setStatusOfAuth, setOwner });
  }, []);

  if (isAuth == null) return <Spinner />;
  else if (!isAuth) {
    Router.push("/signin");
    return <Spinner />;
  }

  return (
    <>
      <HomeLayout>
        <PopUpHandlers />
        <Posts />
      </HomeLayout>
    </>
  );
};

export default Index;

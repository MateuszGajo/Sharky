import React, { useState, useEffect, useContext } from "react";
import Router from "next/router";
import Spinner from "@components/Spinner/Spinner";
import AppContext from "@features/context/AppContext";
import { getOwner } from "@features/service/Functions/index";
import HomeLayout from "@components/Layout/Home/HomeLayout";
import Fanpages from "@components/Lists/Fanpages/Fanpages";
import People from "@components/Lists/People/People";
import Posts from "@components/Lists/Posts/Posts";
import Report from "@common/PopUp/Report/Report";
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
        <Fanpages userId={1} />
        <People userId={1} />
        <Posts userId={1} />
        {/* <Report /> */}
      </HomeLayout>
    </>
  );
};

export default Index;

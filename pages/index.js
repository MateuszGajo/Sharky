import React, { useState, useEffect, useContext } from "react";
import Router from "next/router";
import Spinner from "@components/Spinner/Spinner";
import AppContext from "@features/context/AppContext";
import { getOwner } from "@features/service/Functions/index";
import Posts from "@components/Lists/Posts/Posts";
import Fanpages from "@components/Lists/Fanpages/Fanpages";
import People from "@components/Lists/People/People";
import Groups from "@components/Lists/Groups/Groups";
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
      <Groups userId={1} />
      <People userId={1} />
      <Fanpages userId={1} />
      <Posts userId={1} />
    </>
  );
};

export default Index;

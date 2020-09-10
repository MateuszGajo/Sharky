import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import Signin from "./signin";
import Home from "./home";
import Spinner from "@components/Spinner/Spinner";
import i18next from "@i18n";
import AppContext from "@features/context/AppContext";
import { getOwner } from "@features/service/Functions";
const { useTranslation } = i18next;

const Index = () => {
  const { t } = useTranslation(["index"]);

  const { setOwner } = useContext(AppContext);
  const [isAuth, setStatusOfAuth] = useState(null);

  const description = t("index:description");
  const keyWords = t("index:key-words");

  useEffect(() => {
    getOwner({ setStatusOfAuth, setOwner });
  }, []);

  if (isAuth == null) return <Spinner />;

  return (
    <>
      <Head>
        <meta name="description" content={description} />
        <meta name="author" content="Mateusz Gajo" />
        <meta name="keywords" content={keyWords} />
        <meta name="url" content="https://sharkyapp.herokuapp.com/" />
        <meta property="og:title" content="Sharky" />
        <meta property="og:description" content={description} />
      </Head>
      {isAuth ? <Home /> : <Signin />}
    </>
  );
};

export default Index;

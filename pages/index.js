import React from "react";
import Head from "next/head";
import Signin from "./signin";
import i18next from "@i18n";
const { useTranslation } = i18next;

const Index = () => {
  const { t } = useTranslation(["index"]);

  const description = t("index:description");
  const keyWords = t("index:key-words");
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
      <Signin />
    </>
  );
};

export default Index;

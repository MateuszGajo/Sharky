import React, { useState, useEffect, useContext } from "react";
import Router from "next/router";
import Spinner from "@components/Spinner/Spinner";
import AppContext from "@features/context/AppContext";
import { getOwner } from "@features/service/Functions/index";
import People from "@components/Lists/People/People";
import Posts from "@components/Lists/Posts/Posts";
import Search from "@common/Search/Search";
import Fanpages from "@components/Lists/Fanpages/Fanpages";
import Creator from "@common/PopUp/Creator/Creator";
import "../styles/main.scss";

const Index = () => {
  const { setOwner } = useContext(AppContext);
  const [isAuth, setStatusOfAuth] = useState(null);
  const [text, setText] = useState("");
  const [keyWords, setKeyWords] = useState(null);
  const [isOpen, setStatusOfOpen] = useState(true);

  useEffect(() => {
    getOwner({ setStatusOfAuth, setOwner });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    text != keyWords && setKeyWords(text);
  };

  if (isAuth == null) return <Spinner />;
  else if (!isAuth) {
    Router.push("/signin");
    return <Spinner />;
  }

  return (
    <>
      <form
        className="groups__container__content__search__form"
        onSubmit={handleSubmit}
      >
        <Search value={text} onChange={setText} />
      </form>
      {/* <Posts userId={1} /> */}
      {/* {isOpen && <Creator type="group" setStatusOfOpen={setStatusOfOpen} />} */}
      <People userId={1} />
      {/* <Fanpages userId={1} /> */}
    </>
  );
};

export default Index;

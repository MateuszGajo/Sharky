import React, { useState, useEffect, useContext } from "react";
import Router from "next/router";
import Spinner from "@components/Spinner/Spinner";
import AppContext from "@features/context/AppContext";
import { getOwner } from "@features/service/Functions/index";
import Search from "@common/Search/Search";
import People from "@components/Lists/People/People";
import "../styles/main.scss";

const Index = () => {
  const { setOwner, owner } = useContext(AppContext);
  const [isAuth, setStatusOfAuth] = useState(null);
  const [text, setText] = useState("");
  const [keyWords, setKeyWords] = useState(null);

  useEffect(() => {
    getOwner({ setStatusOfAuth, setOwner });
  }, []);

  if (isAuth == null) return <Spinner />;
  else if (!isAuth) {
    Router.push("/signin");
    return <Spinner />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    text != keyWords && setKeyWords(text);
  };

  return (
    <>
      <section className="groups">
        <div className="groups__search">
          <form className="groups__search__form" onSubmit={handleSubmit}>
            <Search value={text} onChange={setText} />
          </form>
        </div>

        <People idUser={4} keyWords={keyWords} />
      </section>
    </>
  );
};

export default Index;

import React, { useState, useContext, useEffect } from "react";
import Router from "next/router";
import HomeLayout from "@components/Layout/Home/HomeLayout";
import ListOfFanpages from "@components/Lists/Fanpages/Fanpages";
import Search from "@common/Search/Search";
import Spinner from "@components/Spinner/Spinner";
import AppContext from "@features/context/AppContext";
import { getOwner } from "@features/service/Functions/index";
import "../styles/main.scss";

const Fanpages = () => {
  const { owner, setOwner, isAuth, setStatusOfAuth } = useContext(AppContext);

  const [text, setText] = useState("");
  const [keyWords, setKeyWords] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    text != keyWords && setKeyWords(text);
  };

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
      <section className="fanpages">
        {console.log(keyWords)}
        <div className="fanpages__search">
          <form className="fanpages__search__form" onSubmit={handleSubmit}>
            <Search text={text} onChange={setText} />
          </form>
        </div>
        <ListOfFanpages idUser={owner.id} keyWords={keyWords} />
      </section>
    </HomeLayout>
  );
};

export default Fanpages;

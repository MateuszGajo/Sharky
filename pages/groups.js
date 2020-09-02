import React, { useState, useContext, useEffect } from "react";
import Router from "next/router";
import HomeLayout from "../features/components/Layout/Home/HomeLayout";
import ListOfGroups from "../features/components/Lists/Groups/Groups";
import Search from "@common/Search/Search";
import Spinner from "@components/Spinner/Spinner";
import AppContext from "@features/context/AppContext";
import { getOwner } from "@features/service/Functions/index";
import "../styles/main.scss";

const Groups = () => {
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
      <section className="groups">
        <div className="groups__search">
          <form className="groups__search__form" onSubmit={handleSubmit}>
            <Search value={text} onChange={setText} />
          </form>
        </div>

        <ListOfGroups idUser={owner.id} keyWords={keyWords} />
      </section>
    </HomeLayout>
  );
};

export default Groups;

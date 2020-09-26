import React, { useContext, useState, useEffect } from "react";
import Router from "next/router";
import HomeLayout from "@components/Layout/Home/HomeLayout";
import People from "@components/Lists/People/People";
import Spinner from "@components/Spinner/Spinner";
import AppContext from "@features/context/AppContext";
import { getOwner } from "@features/service/Functions/index";
import Search from "@common/Search/Search";
import "../styles/friends.scss";

const Friends = () => {
  const { owner, setOwner } = useContext(AppContext);

  const [keyWords, setKeyWords] = useState(null);
  const [text, setText] = useState("");
  const [isAuth, setStatusOfAuth] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyWords != text) setKeyWords(text);
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
      <section className="friends">
        <div className="friends__search">
          <form onSubmit={handleSubmit} className="friends__search__form">
            <Search value={text} onChange={setText} />
          </form>
        </div>
        <People userId={owner.id} keyWords={keyWords} />
      </section>
    </HomeLayout>
  );
};

export default Friends;

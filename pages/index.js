import React, { useState, useEffect, useContext } from "react";
import Router from "next/router";
import Spinner from "@components/Spinner/Spinner";
import AppContext from "@features/context/AppContext";
import { getOwner } from "@features/service/Functions/index";
import People from "@components/Lists/People/People";
import Posts from "@components/Lists/Posts/Posts";
import Search from "@common/Search/Search";
import Fanpages from "@components/Lists/Fanpages/Fanpages";
import Groups from "@components/Lists/Groups/Groups";
import Creator from "@common/PopUp/Creator/Creator";
import HomeLayout from "@components/Layout/Home/HomeLayout";
import InvitePerson from "@common/PopUp/InvitePerson/InvitePerson";
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
      <HomeLayout>
        <form
          className="groups__container__content__search__form"
          onSubmit={handleSubmit}
        >
          <Search value={text} onChange={setText} />
        </form>
        <Groups userId={1} keyWords={keyWords} />
        <InvitePerson type="group" targetId={8} />
      </HomeLayout>
      {/* <Posts userId={1} /> */}
      {/* {isOpen && <Creator type="fanpage" setStatusOfOpen={setStatusOfOpen} />} */}
      {/* <People userId={1} keyWords={keyWords} /> */}
      {/* <Fanpages userId={1} keyWords={keyWords} /> */}
    </>
  );
};

export default Index;

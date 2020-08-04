import React, { useState, useContext } from "react";
import HomeLayout from "../features/components/Layout/Home/HomeLayout";
import ListOfGroups from "../features/components/Lists/Groups/Groups";
import Search from "@common/Search/Search";
import AppContext from "@features/context/AppContext";
import "../styles/main.scss";

const Groups = () => {
  const { owner } = useContext(AppContext);

  const [text, setText] = useState("");
  const [keyWords, setKeyWords] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    text != keyWords && setKeyWords(text);
  };
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

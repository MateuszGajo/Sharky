import React, { useState, useContext } from "react";
import HomeLayout from "@components/Layout/Home/HomeLayout";
import ListOfFanpages from "@components/Lists/Fanpages/Fanpages";
import Search from "@common/Search/Search";
import AppContext from "@features/context/AppContext";
import "../styles/main.scss";

const Fanpages = () => {
  const { owner } = useContext(AppContext);

  const [text, setText] = useState("");
  const [keyWords, setKeyWords] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    text != keyWords && setKeyWords(text);
  };
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

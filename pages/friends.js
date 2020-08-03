import React, { useContext, useState } from "react";
import HomeLayout from "@components/Layout/Home/HomeLayout";
import People from "@components/Lists/People/People";
import AppContext from "@features/context/AppContext";
import Search from "@common/Search/Search";

const Friends = () => {
  const { owner } = useContext(AppContext);

  const [keyWords, setKeyWords] = useState(null);
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyWords != text) setKeyWords(text);
  };

  return (
    <HomeLayout>
      <section className="friends">
        <div className="friends__search">
          <form onSubmit={handleSubmit} className="friends__search__form">
            <Search value={text} onChange={setText} />
          </form>
        </div>
        <People idUser={owner.id} keyWords={keyWords} />
      </section>
    </HomeLayout>
  );
};

export default Friends;

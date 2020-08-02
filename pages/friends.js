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
      <div className="home-wrapper__main__content__friends">
        {console.log(keyWords)}
        <form onSubmit={handleSubmit}>
          <Search value={text} onChange={setText} />
        </form>
        <People idUser={owner.id} keyWords={keyWords} />
      </div>
    </HomeLayout>
  );
};

export default Friends;

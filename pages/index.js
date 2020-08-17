import React, { useEffect, useState, useContext } from "react";
import i18next from "@i18n";
import Spinner from "@components/Spinner/Spinner";
import Posts from "@components/Lists/Posts/Posts";
import HomeLayout from "@components/Layout/Home/HomeLayout";
import AppContext from "@features/context/AppContext";
import Error from "@common/PopUp/Error/Error";
import Prompt from "@common/PopUp/Prompt/Prompt";
import People from "@components/Lists/People/People";
import Groups from "@components/Lists/Groups/Groups";
import Fanpages from "@components/Lists/Fanpages/Fanpages";
import MessageBox from "@common/MessageBox/MessageBox";
import InvitePerson from "@common/PopUp/InvitePerson/InvitePerson";
import Search from "@common/Search/Search";
import "../styles/main.scss";

const Index = () => {
  const [initialized, setInitialized] = useState(false);
  // const [newPost, setNewPost] = useState({ photo: "", content: "" });
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [newPost, setNewPost] = useState();
  const [user, setUser] = useState("");
  const [keyWords, setKeyWords] = useState(null);

  const { isError, isPrompt, owner, setError } = useContext(AppContext);

  useEffect(() => {
    i18next.initPromise.then((resp) => setInitialized(true));
  }, []);

  if (!initialized) return <Spinner />;

  const handleSubmit = (e) => {
    e.preventDefault();

    setNewPost({ content, file });
  };

  const handleSubmitt = (e) => {
    e.preventDefault();
    setKeyWords(user);
  };

  return (
    <>
      {isError && <Error message={isError} />}
      {isPrompt && <Prompt message={isPrompt} />}
      <HomeLayout>
        {/* <button onClick={() => setError("error")}>click</button> */}
        {/* <People idUser={1} /> */}
        <form onSubmit={handleSubmitt}>
          <Search value={user} onChange={setUser} />
        </form>
        <People idUser={1} keyWords={keyWords} />
        {owner.id && <Groups idUser={1} keyWords={keyWords} />}
        {owner.id && <Fanpages idUser={1} keyWords={keyWords} />}

        {/* <form onSubmit={handleSubmit}>
          <MessageBox
            value={content}
            onChange={setContent}
            file={file}
            setFile={setFile}
          />
        </form>
        <Posts newPost={newPost} idUser={1} /> */}
        {/* <InvitePerson type="group" idTarget={1} /> */}
      </HomeLayout>
    </>
  );
};

export default Index;

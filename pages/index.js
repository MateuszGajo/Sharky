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
import "../styles/main.scss";

const Index = () => {
  const [initialized, setInitialized] = useState(false);
  const [newPost, setNewPost] = useState({ photo: "", content: "" });

  const { isError, isPrompt, owner } = useContext(AppContext);

  useEffect(() => {
    i18next.initPromise.then((resp) => setInitialized(true));
  }, []);

  if (!initialized) return <Spinner />;

  return (
    <>
      {isError && <Error message={isError} />}
      {isPrompt && <Prompt message={isPrompt} />}
      <HomeLayout>
        <People />
        <Groups idUser={owner.id} />
        <Fanpages idUser={owner.id} />
        <Posts newPost={newPost} />
      </HomeLayout>
    </>
  );
};

export default Index;

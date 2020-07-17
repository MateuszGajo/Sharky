import React, { useEffect, useState, useContext } from "react";
import i18next from "@i18n";
import Spinner from "@components/Spinner/Spinner";
import Posts from "@components/Lists/Posts/Posts";
import HomeLayout from "@components/Layout/Home/HomeLayout";
import AppContext from "@features/context/AppContext";
import Error from "@common/PopUp/Error/Error";
import "../styles/main.scss";

const Index = () => {
  console.log(i18next);
  const [initialized, setInitialized] = useState(false);

  const { isError } = useContext(AppContext);

  useEffect(() => {
    i18next.initPromise.then((resp) => setInitialized(true));
  }, []);

  if (!initialized) return <Spinner />;

  return (
    <>
      {isError.occur && <Error message={isError.message} />}
      <HomeLayout>
        <Posts />
      </HomeLayout>
    </>
  );
};

export default Index;

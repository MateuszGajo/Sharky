import React, { useEffect, useState, useContext } from "react";
import i18next from "../i18n";
import Spinner from "../features/components/Spinner/Spinner";
import Posts from "../features/components/Lists/Posts/Posts";
import HomeLayout from "../features/components/Layout/Home/HomeLayout";
import AppContext from "../features/context/AppContext";
import Error from "../features/common/PopUp/Error/Error";
import "../styles/main.scss";

const Index = () => {
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

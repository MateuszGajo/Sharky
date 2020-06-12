import React, { useEffect, useState } from "react";
import i18next from "../i18n";
import Spinner from "../features/components/Spinner/Spinner";
import MessageBox from "../features/components/Lists/People/People";
import "../styles/main.scss";

const Index = () => {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    i18next.initPromise.then((resp) => setInitialized(true));
  }, []);
  if (!initialized) return <Spinner />;
  return <MessageBox />;
};

export default Index;

import React, { useEffect, useState, useContext } from "react";
import i18next from "@i18n";
import Spinner from "@components/Spinner/Spinner";
import Messages from "./messages";
import "../styles/main.scss";

const Index = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    i18next.initPromise.then((resp) => setInitialized(true));
  }, []);

  if (!initialized) return <Spinner />;

  return <Messages />;
};

export default Index;

import React, { useEffect, useState } from "react";
import Friends from "./friends";
import Spinner from "@components/Spinner/Spinner";
import i18next from "@i18n";
import "../styles/main.scss";

const Index = () => {
  const [initialized, setInitialized] = useState(null);
  useEffect(() => {
    i18next.initPromise.then((resp) => setInitialized(true));
  }, []);

  if (!initialized) return <Spinner />;
  return <Friends />;
};
export default Index;

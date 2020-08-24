import React, { useEffect, useState } from "react";
import i18next from "@i18n";
import Settings from "./settings";
import Spinner from "@components/Spinner/Spinner";

const Index = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    i18next.initPromise.then((resp) => setInitialized(true));
  }, []);
  if (!initialized) return <Spinner />;
  return <Settings />;
};

export default Index;

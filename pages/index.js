import React, { useEffect, useState } from "react";
import i18next from "@i18n";
import Settings from "./settings";

const Index = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    i18next.initPromise.then((resp) => setInitialized(true));
  }, []);

  return <Settings />;
};

export default Index;

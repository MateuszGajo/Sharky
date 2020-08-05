import React, { useEffect, useState } from "react";
import i18next from "@i18n";
import Spinner from "@components/Spinner/Spinner";
import Fanpage from "./fanpage/[id]";

const Index = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    i18next.initPromise.then((resp) => setInitialized(true));
  }, []);

  if (!initialized) return <Spinner />;

  return <div>f</div>;
};

export default Index;

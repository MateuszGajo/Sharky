import React, { useEffect, useState } from "react";
import i18next from "@i18n";

const Index = () => {
  console.log(i18next);
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    i18next.initPromise.then((resp) => setInitialized(false));
  }, []);

  return <div>dsa</div>;
};

export default Index;

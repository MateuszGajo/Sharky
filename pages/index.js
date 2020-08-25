import React, { useEffect, useState } from "react";
import i18next from "@i18n";
import Spinner from "@components/Spinner/Spinner";
import PrimaryInput from "@common/PrimaryInput/PrimaryInput";

import "../styles/main.scss";

const Index = () => {
  const [initialized, setInitialized] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    i18next.initPromise.then((resp) => setInitialized(true));
  }, []);

  if (!initialized) return <Spinner />;

  return (
    <PrimaryInput
      value={text}
      onChange={setText}
      title="input"
      name="nazwa"
      size="medium"
      autocompleteData={[
        { name: "poland", value: "polska" },
        { name: "germany", value: "niemcy" },
      ]}
    />
  );
};

export default Index;

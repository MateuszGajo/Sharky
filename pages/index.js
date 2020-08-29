import React, { useEffect, useState } from "react";
import i18next from "@i18n";
import Spinner from "@components/Spinner/Spinner";
import PrimaryInput from "@common/PrimaryInput/PrimaryInput";
import ConfirmUser from "@common/PopUp/ConfirmUser/ConfirmUser";
import Posts from "@components/Lists/Posts/Posts";

import "../styles/main.scss";

const Index = () => {
  const [initialized, setInitialized] = useState(false);
  const [text, setText] = useState("");
  const [isOpen, setOpen] = useState(true);
  const [verify, setVerify] = useState();

  useEffect(() => {
    i18next.initPromise.then((resp) => setInitialized(true));
  }, []);

  if (!initialized) return <Spinner />;

  return (
    <>
      <Posts news={true} />
    </>
  );
};

export default Index;

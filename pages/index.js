import React, { useEffect, useState } from "react";
import i18next from "../i18n";
import Spinner from "../features/components/Spinner/Spinner";
import Home from "./home";
import "../styles/main.scss";

const Index = () => {
  // const [initialized, setInitialized] = useState({ i18: false, auth: false });
  // useEffect(() => {
  //   i18next.initPromise.then((resp) =>
  //     setInitialized({ ...initialized, i18n: true })
  //   );

  //   axios.get("/auth/me").then(({ data: { verify } }) => {
  //     if (!verify) {
  //       Router.push("/signin");
  //     } else setInitialized({ ...initialized, auth: true });
  //   });
  // }, []);
  // if (!initialized.i18n && !initialized.auth) return <Spinner />;
  return <Home />;
};

export default Index;

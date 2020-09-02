import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import NavBar from "@components/Layout/Home/Compound/components/NavBar/Navbar";
import AboutMe from "@components/Profile/AboutMe/AboutMe";
import DisplayItem from "@components/Profile/DisplayItem/DisplayItem";
import Spinner from "@components/Spinner/Spinner";
import Error from "@common/PopUp/Error/Error";
import AppContext from "@features/context/AppContext";
import i18next from "@i18n";
import { getOwner } from "@features/service/Functions/index";
import "../../styles/main.scss";
const { useTranslation } = i18next;

const profile = () => {
  const router = useRouter();
  const idUser = router.query.id;

  const { t } = useTranslation(["profile"]);

  const { isError, setOwner, isAuth, setStatusOfAuth } = useContext(AppContext);

  const [chooseItem, setChooseItem] = useState("");
  const [isLoading, setStatusOfLoading] = useState(true);
  const [info, setInfo] = useState({});
  const [userError, setUserError] = useState("");

  useEffect(() => {
    idUser &&
      isAuth &&
      axios
        .post("/user/info", { idUser })
        .then(({ data: { info } }) => {
          setInfo(info);
          setStatusOfLoading(false);
        })
        .catch(({ response: { status, data: message } }) => {
          if (status == 404) {
            setUserError(message);
            setStatusOfLoading(false);
          }
        });
  }, [idUser, isAuth]);

  useEffect(() => {
    getOwner({ setStatusOfAuth, setOwner });
  }, []);

  if (isAuth == null) return <Spinner />;
  else if (!isAuth) {
    router.push("/signin");
    return <Spinner />;
  } else if (isLoading) return <Spinner />;

  return (
    <section className="profile">
      {isError && <Error message={isError} />}
      <NavBar />
      {!userError ? (
        <>
          {chooseItem !== "" ? (
            <DisplayItem
              setChooseItem={setChooseItem}
              chooseItem={chooseItem}
              info={info}
              idUser={idUser}
            />
          ) : (
            <AboutMe
              setChooseItem={setChooseItem}
              info={info}
              idUser={idUser}
            />
          )}
        </>
      ) : (
        <div className="profile__error">{t(`profile:error.${userError}`)}</div>
      )}
    </section>
  );
};

export default profile;
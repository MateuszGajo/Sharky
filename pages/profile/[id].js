import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import axios from "@features/service/Axios";
import NavBar from "@components/Layout/Home/Compound/components/NavBar/NavBar";
import ProfileInfo from "@components/Profile/ProfileInfo/ProfileInfo";
import DisplayItem from "@components/Profile/DisplayItem/DisplayItem";
import Spinner from "@components/Spinner/Spinner";
import PopUpHandlers from "@components/PopUpHandlers/PopUpHandlers";
import AppContext from "@features/context/AppContext";
import i18next from "@i18n";
import { getOwner } from "@features/service/Functions/index";
import "@styles/profile.scss";
const { useTranslation } = i18next;

const profile = () => {
  const router = useRouter();
  const userId = Number(router.query.id);

  const { t } = useTranslation(["profile"]);

  const { setOwner } = useContext(AppContext);

  const [chooseItem, setChooseItem] = useState("");
  const [isLoading, setStatusOfLoading] = useState(true);
  const [info, setInfo] = useState({});
  const [userError, setUserError] = useState("");
  const [isAuth, setStatusOfAuth] = useState(null);

  useEffect(() => {
    userId &&
      isAuth &&
      axios
        .post("/user/info", { userId })
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
  }, [userId, isAuth]);

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
      <PopUpHandlers />
      <NavBar />
      {!userError ? (
        <>
          {chooseItem !== "" ? (
            <DisplayItem
              setChooseItem={setChooseItem}
              chooseItem={chooseItem}
              info={info}
              userId={userId}
            />
          ) : (
            <ProfileInfo
              setChooseItem={setChooseItem}
              info={info}
              userId={userId}
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

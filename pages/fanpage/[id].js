import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import axios from "~features/service/Axios";
import HomeLayout from "~components/Layout/Home/HomeLayout";
import Navbar from "~components/Fanpage/Navbar/Navbar";
import Content from "~components/Fanpage/Content/Content";
import Spinner from "~components/Spinner/Spinner";
import PopUpHandlers from "~components/PopUpHandlers/PopUpHandlers";
import i18next from "~i18n";
import AppContext from "~features/context/AppContext";
import { getOwner } from "~features/service/Functions/index";
import "../../styles/fanpage.scss";

const { useTranslation } = i18next;

const Fanpage = () => {
  const router = useRouter();
  const fanpageId = Number(router.query.id);

  const { t } = useTranslation(["fanpage"]);

  const homeName = t("fanpage:home");

  const { setOwner } = useContext(AppContext);

  const [section, setSection] = useState(homeName);
  const [subId, setIdSub] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setStatusOfLoading] = useState(true);
  const [fanpageError, setFanpageError] = useState("");
  const [isAuth, setStatusOfAuth] = useState(null);

  useEffect(() => {
    fanpageId &&
      isAuth &&
      axios
        .post("/fanpage/enter", { fanpageId })
        .then(({ data: { initialSubId, initialRole } }) => {
          setIdSub(initialSubId);
          setRole(initialRole);
          setStatusOfLoading(false);
        })
        .catch(({ response: { status, data: message } }) => {
          if (status === 404) {
            setFanpageError(message);
            setStatusOfLoading(false);
          }
        });
  }, [fanpageId, isAuth]);

  useEffect(() => {
    getOwner({ setStatusOfAuth, setOwner });
  }, []);

  if (isAuth === null) return <Spinner />;
  if (!isAuth) {
    router.push("/signin");
    return <Spinner />;
  }
  if (isLoading) return <Spinner />;

  return (
    <HomeLayout>
      <PopUpHandlers />
      <section className="fanpage">
        {!fanpageError ? (
          <>
            <Navbar
              setIdSub={setIdSub}
              setSection={setSection}
              subId={subId}
              role={role}
              fanpageId={fanpageId}
            />
            <Content section={section} fanpageId={fanpageId} role={role} />
          </>
        ) : (
          <div className="fanpage__error">
            {t(`fanpage:error.${fanpageError}`)}
          </div>
        )}
      </section>
    </HomeLayout>
  );
};

export default Fanpage;

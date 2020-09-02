import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import HomeLayout from "@components/Layout/Home/HomeLayout";
import Navbar from "@components/Fanpage/Navbar/Navbar";
import Content from "@components/Fanpage/Content/Content";
import Spinner from "@components/Spinner/Spinner";
import i18next from "@i18n";
import AppContext from "@features/context/AppContext";
import Error from "@common/PopUp/Error/Error";

import { getOwner } from "@features/service/Functions/index";

import "../../styles/main.scss";

const { useTranslation } = i18next;

const Fanpage = () => {
  const router = useRouter();
  const idFanpage = router.query.id;

  const { t } = useTranslation(["fanpage"]);

  const homeName = t("fanpage:home");
  const fanpageDoesNotExist = t("fanpage:does-not-exist");

  const { isError, isAuth, setStatusOfAuth, setOwner } = useContext(AppContext);

  const [section, setSection] = useState(homeName);
  const [idSub, setIdSub] = useState(null);
  const [role, setRole] = useState(null);
  const [isFanpageExist, setStatusOfExistFanpage] = useState(true);

  useEffect(() => {
    idFanpage &&
      isAuth &&
      axios
        .post("/fanpage/enter", { idFanpage })
        .then(({ data: { idSub, role, id } }) => {
          if (!id) setStatusOfExistFanpage(false);
          setIdSub(idSub);
          setRole(role);
        });
  }, [idFanpage]);

  useEffect(() => {
    getOwner({ setStatusOfAuth, setOwner });
  }, []);

  if (isAuth == null) return <Spinner />;
  else if (!isAuth) {
    router.push("/signin");
    return <Spinner />;
  }

  return (
    <HomeLayout>
      {isError && <Error message={isError} />}
      <section className="fanpage">
        {isFanpageExist ? (
          <>
            <Navbar
              setIdSub={setIdSub}
              setSection={setSection}
              idSub={idSub}
              role={role}
              idFanpage={idFanpage}
            />
            <Content section={section} idFanpage={idFanpage} role={role} />
          </>
        ) : (
          <div className="fanpage__does-not-exist">
            <span className="fanpage__does-not-exist--span">
              {fanpageDoesNotExist}
            </span>
          </div>
        )}
      </section>
    </HomeLayout>
  );
};

export default Fanpage;

import React, { useState, useContext, useEffect } from "react";
import Router from "next/router";
import { IoIosAddCircleOutline } from "react-icons/io";
import ListOfFanpages from "~components/Lists/Fanpages/Fanpages";
import Search from "~common/Search/Search";
import Spinner from "~components/Spinner/Spinner";
import NavBar from "~components/Layout/Home/Compound/components/NavBar/NavBar";
import Creator from "~common/PopUp/Creator/Creator";
import PopUpHandlers from "~components/PopUpHandlers/PopUpHandlers";
import AppContext from "~features/context/AppContext";
import { getOwner } from "~features/service/Functions/index";
import i18next from "~i18n";
import "../styles/fanpages.scss";

const { useTranslation } = i18next;

const Fanpages = () => {
  const { owner, setOwner } = useContext(AppContext);

  const { t } = useTranslation(["fanpages"]);

  const createFanpage = t("fanpages:create-fanpage");

  const [text, setText] = useState("");
  const [keyWords, setKeyWords] = useState(null);
  const [isAuth, setStatusOfAuth] = useState(null);
  const [isCreatorOpen, setStatusOfCreatorOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    text !== keyWords && setKeyWords(text);
  };

  useEffect(() => {
    getOwner({ setStatusOfAuth, setOwner });
  }, []);

  if (isAuth == null) return <Spinner />;
  if (!isAuth) {
    Router.push("/signin");
    return <Spinner />;
  }

  return (
    <>
      <PopUpHandlers />
      {isCreatorOpen && (
        <Creator type="fanpage" setStatusOfOpen={setStatusOfCreatorOpen} />
      )}
      <section className="fanpages">
        <NavBar />
        <div className="fanpages__content">
          <div className="fanpages__search">
            <form className="fanpages__search__form" onSubmit={handleSubmit}>
              <Search text={text} onChange={setText} />
            </form>
          </div>
          <ListOfFanpages userId={owner.id} keyWords={keyWords} />
        </div>
        <div className="fanpages__side-bar">
          <div
            className="fanpages__side-bar__create"
            onClick={() => setStatusOfCreatorOpen(true)}
            aria-hidden="true"
          >
            <div className="fanpages__side-bar__create__button">
              <IoIosAddCircleOutline />
            </div>
            <div className="fanpages__side-bar__create__text">
              <span className="fanpages__side-bar__create__text__span">
                {createFanpage}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Fanpages;

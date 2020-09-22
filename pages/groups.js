import React, { useState, useContext, useEffect } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import Router from "next/router";
import ListOfGroups from "../features/components/Lists/Groups/Groups";
import Search from "@common/Search/Search";
import Spinner from "@components/Spinner/Spinner";
import NavBar from "@components/Layout/Home/Compound/components/NavBar/NavBar";
import Creator from "@common/PopUp/Creator/Creator";
import AppContext from "@features/context/AppContext";
import { getOwner } from "@features/service/Functions/index";
import i18next from "@i18n";
import "../styles/groups.scss";

const { useTranslation } = i18next;

const Groups = () => {
  const { owner, setOwner } = useContext(AppContext);

  const { t } = useTranslation(["groups"]);

  const createGroupText = t("groups:create-group");

  const [text, setText] = useState("");
  const [keyWords, setKeyWords] = useState(null);
  const [isAuth, setStatusOfAuth] = useState(null);
  const [isOpenCreator, setStatusOfOpenCreator] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    text != keyWords && setKeyWords(text);
  };

  useEffect(() => {
    getOwner({ setStatusOfAuth, setOwner });
  }, []);

  if (isAuth == null) return <Spinner />;
  else if (!isAuth) {
    Router.push("/signin");
    return <Spinner />;
  }
  return (
    <>
      {isOpenCreator && (
        <Creator setStatusOfOpen={setStatusOfOpenCreator} type="group" />
      )}
      <section className="groups">
        <NavBar />
        <div className="groups__container">
          <div className="groups__container__content">
            <div className="groups__container__content__search">
              <form
                className="groups__container__content__search__form"
                onSubmit={handleSubmit}
              >
                <Search value={text} onChange={setText} />
              </form>
            </div>

            <ListOfGroups idUser={owner.id} keyWords={keyWords} />
          </div>
          <div className="groups__side-bar">
            <div className="groups__side-bar__create">
              <div
                className="groups__side-bar__create__button"
                onClick={() => {
                  setStatusOfOpenCreator(true);
                }}
              >
                <IoIosAddCircleOutline />
              </div>
              <div className="groups__side-bar__create__text">
                <span className="groups__side-bar__create__text--span">
                  {createGroupText}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Groups;

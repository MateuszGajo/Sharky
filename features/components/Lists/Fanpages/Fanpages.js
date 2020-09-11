import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { AiOutlineSearch } from "react-icons/ai";
import Card from "../Card/Card";
import i18next from "@i18n";
import AppContext from "@features/context/AppContext";
import Spinner from "@components/Spinner/Spinner";
const { useTranslation } = i18next;

const Fanpages = ({
  idUser,
  keyWords,
  onlySubscribed = false,
  helpInformation = true,
}) => {
  const { t } = useTranslation(["component"]);
  const description = t("component:lists.fanpages.description");
  const buttonSubscribe = t("component:lists.fanpages.button-subscribe");
  const buttonUnsubscribe = t("component:lists.fanpages.button-unsubscribe");
  const emptyContent = t("component:lists.fanpages.empty-content");
  const noResult = t("component:lists.fanpages.no-result");

  const { owner, setError } = useContext(AppContext);

  const [fanpage, setFanpage] = useState({ id: null, name: "", idSub: null });
  const [fanpages, setFanpages] = useState([]);
  const [isMore, setStatusOfMore] = useState();

  const fetchData = (from) => {
    axios
      .post("/fanpage/get", { from, idUser, keyWords, onlySubscribed })
      .then(({ data: { fanpages: f, isMore } }) => {
        setFanpages([...fanpages, ...f]);
        setStatusOfMore(isMore);
      })
      .catch(({ response: { data: message } }) => setError(message));
  };

  useEffect(() => {
    fetchData(0);
  }, []);

  useEffect(() => {
    const { setNumber, number, idRef, setIdRef, id } = fanpage;
    if (idRef)
      axios
        .post("/fanpage/user/delete", { idSub: fanpage.idRef })
        .then(() => {
          if (idUser == owner.id) {
            const newFanpages = fanpages.filter(
              (fanpage) => fanpage.idFanpage != id
            );
            setFanpages(newFanpages);
          } else {
            setIdRef(null);
            setNumber(Number(number) - 1);
          }
        })
        .catch(({ response: { data: message } }) => setError(message));
    else if (id)
      axios
        .post("/fanpage/user/add", { idFanpage: fanpage.id })
        .then(({ data: { id } }) => {
          setNumber(Number(number) + 1);
          setIdRef(id);
        })
        .catch(({ response: { data: message } }) => setError(message));
  }, [fanpage]);

  useEffect(() => {
    if (keyWords != null)
      axios
        .post("/fanpage/get", { from: 0, idUser, keyWords, onlySubscribed })
        .then(({ data: { fanpages, isMore } }) => {
          setFanpages(fanpages);
          setStatusOfMore(isMore);
        })
        .catch(({ response: { data: message } }) => setError(message));
  }, [keyWords]);

  if (!fanpages) return <Spinner />;
  return (
    <InfiniteScroll
      dataLength={fanpages.length}
      next={() => fetchData(fanpages.length)}
      hasMore={isMore}
      loader={<Spinner />}
    >
      <div className="list">
        {fanpages.map((fanpage) => {
          const { idFanpage, name, photo, numberOfSubscribes } = fanpage;
          const data = {
            refType: "fanpage",
            id: idFanpage,
            idRef: fanpage.idSub || null,
            photo,
            radiusPhoto: true,
            name,
            description,
            number: numberOfSubscribes,
            button: "join",
            subTitle: buttonSubscribe,
            unsubTitle: buttonUnsubscribe,
            collapse: false,
          };
          return <Card data={data} key={idFanpage} handleClick={setFanpage} />;
        })}
      </div>
      {!fanpages.length && helpInformation && (
        <div className="empty-card">
          <div className="empty-card__icon">
            <AiOutlineSearch />
          </div>
          <div className="empty-card__text">
            <span className="empty-card__text--span">
              {keyWords ? noResult : emptyContent}
            </span>
          </div>
        </div>
      )}
    </InfiniteScroll>
  );
};

export default Fanpages;

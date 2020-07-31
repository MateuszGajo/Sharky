import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "../Card/Card";
import i18next from "@i18n";
import AppContext from "@features/context/AppContext";
import Spinner from "@components/Spinner/Spinner";
const { useTranslation } = i18next;

const Fanpages = ({ idUser, keyWords }) => {
  const { t } = useTranslation(["component"]);
  const description = t("component:lists.fanpages.description");
  const buttonSubscribe = t("component:lists.fanpages.button-subscribe");
  const buttonUnsubscribe = t("component:lists.fanpages.button-unsubscribe");

  const { owner, setError } = useContext(AppContext);

  const [fanpage, setFanpage] = useState({ id: null, name: "", idSub: null });
  const [fanpages, setFanpages] = useState([]);
  const [isMore, setStatusOfMore] = useState();

  const fetchData = (from) => {
    axios
      .post("/fanpage/get", { from, idUser, keyWords })
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
    if (fanpage.idRef)
      axios
        .post("/fanpage/user/delete", { idSub: fanpage.idRef })
        .then(() => fanpage.setIdRef(null))
        .catch(({ response: { data: message } }) => setError(message));
    else if (fanpage.id)
      axios
        .post("/fanpage/user/add", { idFanpage: fanpage.id })
        .then(({ data: { id } }) => fanpage.setIdRef(id))
        .catch(({ response: { data: message } }) => setError(message));
  }, [fanpage]);

  useEffect(() => {
    if (keyWords)
      axios
        .post("/fanpage/get", { from: 0, idUser, keyWords })
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
            refId: idFanpage,
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
    </InfiniteScroll>
  );
};

export default Fanpages;

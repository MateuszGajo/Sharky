import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "~features/service/Axios";
import Card from "../Card/Card";
import i18next from "~i18n";
import AppContext from "~features/context/AppContext";
import Spinner from "~components/Spinner/Spinner";

const { useTranslation } = i18next;

const Fanpages = ({
  userId,
  keyWords = "",
  onlySubscribed = false,
  helpInformation = true,
}) => {
  const { t } = useTranslation(["component"]);
  const description = t("component:lists.fanpages.description");
  const subscribeText = t("component:lists.fanpages.subscribe");
  const unsubscribeText = t("component:lists.fanpages.unsubscribe");
  const emptyContent = t("component:lists.fanpages.empty-content");
  const noResult = t("component:lists.fanpages.no-result");

  const { owner, setError } = useContext(AppContext);

  const [fanpage, setFanpage] = useState({ id: null, name: "", subId: null });
  const [fanpages, setFanpages] = useState([]);
  const [isMore, setStatusOfMore] = useState();

  const fetchData = (from) => {
    axios
      .post("/fanpage/get", { from, userId, keyWords, onlySubscribed })
      .then(({ data: { fanpages: f, isMoreFanpages } }) => {
        setFanpages([...fanpages, ...f]);
        setStatusOfMore(isMoreFanpages);
      })
      .catch(({ response: { data: message } }) => setError(message));
  };

  useEffect(() => {
    fetchData(0);
  }, []);

  useEffect(() => {
    const { setNumber, subId, setSubId, id } = fanpage;
    if (subId) {
      axios
        .post("/fanpage/unsubscribe", { fanpageId: id })
        .then(() => {
          if (userId === owner.id && !keyWords) {
            const newFanpages = fanpages.filter(
              (item) => item.fanpageId !== id
            );
            setFanpages(newFanpages);
          } else {
            setSubId(null);
            setNumber((prev) => prev - 1);
          }
        })
        .catch(({ response: { data: message } }) => setError(message));
    } else if (id) {
      axios
        .post("/fanpage/subscribe", { fanpageId: fanpage.id })
        .then(({ data: { id: fanpageSubId } }) => {
          setNumber((prev) => prev + 1);
          setSubId(fanpageSubId);
        })
        .catch(({ response: { data: message } }) => setError(message));
    }
  }, [fanpage]);

  useEffect(() => {
    if (keyWords != null) {
      axios
        .post("/fanpage/get", { from: 0, userId, keyWords, onlySubscribed })
        .then(({ data: { fanpages: initialFanpages, isMoreFanpages } }) => {
          setFanpages(initialFanpages);
          setStatusOfMore(isMoreFanpages);
        })
        .catch(({ response: { data: message } }) => setError(message));
    }
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
        {fanpages.map((item) => {
          const { fanpageId, subId, name, photo, numberOfSubscribes } = item;
          const data = {
            cardInfo: {
              id: fanpageId,
              refId: fanpageId,
              subId,
              refType: "fanpage",
              photo,
              radiusPhoto: true,
              name,
              description,
              number: numberOfSubscribes,
            },
            texts: {
              subTitle: subscribeText,
              unsubTitle: unsubscribeText,
            },
            collapse: {
              isCollapse: false,
            },
          };
          return <Card data={data} key={fanpageId} handleClick={setFanpage} />;
        })}
      </div>
      {!fanpages.length && helpInformation && (
        <div className="empty-card">
          <div className="empty-card__icon">
            <AiOutlineSearch />
          </div>
          <div className="empty-card__text">
            <span className="empty-card__text__span">
              {keyWords ? noResult : emptyContent}
            </span>
          </div>
        </div>
      )}
    </InfiniteScroll>
  );
};

Fanpages.defaultProps = {
  keyWords: "",
  onlySubscribed: false,
  helpInformation: true,
};

Fanpages.propTypes = {
  userId: PropTypes.number.isRequired,
  keyWords: PropTypes.string,
  onlySubscribed: PropTypes.bool,
  helpInformation: PropTypes.bool,
};

export default Fanpages;

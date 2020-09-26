import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { AiOutlineSearch } from "react-icons/ai";
import Card from "../Card/Card";
import i18next from "@i18n";
import AppContext from "@features/context/AppContext";
import Spinner from "@components/Spinner/Spinner";
const { useTranslation } = i18next;

const Groups = ({
  userId,
  keyWords = "",
  onlySubscribed = false,
  helpInformation = true,
}) => {
  const { t } = useTranslation(["component"]);
  const description = t("component:lists.groups.description");
  const buttonJoin = t("component:lists.groups.button-join");
  const buttonLeave = t("component:lists.groups.button-leave");
  const emptyContent = t("component:lists.groups.empty-content");
  const noResult = t("component:lists.groups.no-result");

  const { owner, setError } = useContext(AppContext);

  const [group, setGroup] = useState({ id: null, name: "", subId: null });
  const [groups, setGroups] = useState([]);
  const [isMore, setStatusOfMore] = useState();

  const fetchData = (from) => {
    axios
      .post("/group/get", { from, userId, keyWords, onlySubscribed })
      .then(({ data: { groups: g, isMore } }) => {
        setGroups([...groups, ...g]);
        setStatusOfMore(isMore);
      })
      .catch(({ response: { data: message } }) => setError(message));
  };

  useEffect(() => {
    fetchData(0);
  }, []);

  useEffect(() => {
    if (keyWords != null)
      axios
        .post("/group/get", { from: 0, userId, keyWords, onlySubscribed })
        .then(({ data: { groups, isMore } }) => {
          setGroups(groups);
          setStatusOfMore(isMore);
        })
        .catch(({ response: { data: message } }) => setError(message));
  }, [keyWords]);

  useEffect(() => {
    const { number, setNumber, idRef, setIdRef, id } = group;
    if (idRef)
      axios
        .post("/group/user/delete", { subId: group.idRef })
        .then(() => {
          if (userId == owner.id) {
            const newGroups = groups.filter((group) => group.groupId != id);
            setGroups(newGroups);
          } else {
            setNumber(Number(number) - 1);
            setIdRef(null);
          }
        })
        .catch(({ response: { data: message } }) => setError(message));
    else if (id)
      axios
        .post("/group/user/add", { groupId: group.id })
        .then(({ data: { id } }) => {
          setIdRef(id);
          setNumber(Number(number) + 1);
        })
        .catch(({ response: { data: message } }) => setError(message));
  }, [group]);

  if (!groups) return <Spinner />;
  return (
    <InfiniteScroll
      dataLength={groups.length}
      next={() => fetchData(groups.length)}
      hasMore={isMore}
      loader={<Spinner />}
    >
      <div className="list">
        {groups.map((group) => {
          const { groupId, subId, name, photo, numberOfMembers } = group;
          const data = {
            refType: "group",
            id: groupId,
            idRef: group.subId || null,
            photo,
            radiusPhoto: true,
            name,
            description,
            number: numberOfMembers,
            button: "join",
            subTitle: buttonJoin,
            unsubTitle: buttonLeave,
            collapse: false,
          };
          return <Card data={data} key={groupId} handleClick={setGroup} />;
        })}
      </div>
      {!groups.length && helpInformation && (
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

export default Groups;

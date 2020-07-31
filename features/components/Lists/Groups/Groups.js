import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "../Card/Card";
import i18next from "@i18n";
import AppContext from "@features/context/AppContext";
import Spinner from "@components/Spinner/Spinner";
const { useTranslation } = i18next;

const Groups = ({ idUser, keyWords = "" }) => {
  const { t } = useTranslation(["component"]);
  const description = t("component:lists.groups.description");
  const buttonJoin = t("component:lists.groups.button-join");
  const buttonLeave = t("component:lists.groups.button-leave");

  const { owner, setError } = useContext(AppContext);

  const [group, setGroup] = useState({ id: null, name: "", idSub: null });
  const [groups, setGroups] = useState([]);
  const [isMore, setStatusOfMore] = useState();

  const fetchData = (from) => {
    axios
      .post("/group/get", { from, idUser, keyWords })
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
    if (keyWords)
      axios
        .post("/group/get", { from: 0, idUser, keyWords })
        .then(({ data: { groups, isMore } }) => {
          setGroups(groups);
          setStatusOfMore(isMore);
        })
        .catch(({ response: { data: message } }) => setError(message));
  }, [keyWords]);

  useEffect(() => {
    if (group.idRef)
      axios
        .post("/group/user/delete", { idSub: group.idRef })
        .then(() => group.setIdRef(null))
        .catch(({ response: { data: message } }) => setError(message));
    else if (group.id)
      axios
        .post("/group/user/add", { idGroup: group.id })
        .then(({ data: { id } }) => group.setIdRef(id))
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
          const { idGroup, idSub, name, photo, numberOfMembers } = group;
          const data = {
            refType: "group",
            id: idGroup,
            idRef: group.idSub || null,
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
          return <Card data={data} key={idGroup} handleClick={setGroup} />;
        })}
      </div>
    </InfiniteScroll>
  );
};

export default Groups;

import React, { useState, useEffect, useContext } from "react";
import Card from "../Card/Card";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "@components/Spinner/Spinner";
import AppContext from "@features/context/AppContext";
import i18n from "@i18n";
const { useTranslation } = i18n;

const People = ({ idUser, keyWords = "" }) => {
  const { t } = useTranslation(["component"]);

  const relationChangeText = t("component:lists.people.relation-change");
  const description = t("component:lists.people.description");
  const friendName = t("component:lists.people.friend");
  const familyName = t("component:lists.people.family");
  const palName = t("component:lists.people.pal");

  const { setError, setPrompt, owner } = useContext(AppContext);
  const [relation, setRelation] = useState({ id: null, name: "" });
  const [friends, setFriends] = useState([]);
  const [isMore, setStatusOfMore] = useState(false);

  const fetchData = (from) => {
    console.log(idUser, from, keyWords);
    axios
      .post("/friend/get/people", { idUser, from, keyWords })
      .then(({ data: { friends: f, isMore } }) => {
        setFriends([...friends, ...f]);
        setStatusOfMore(isMore);
      });
  };

  useEffect(() => {
    if (relation.id != null) {
      setPrompt(relationChangeText);
      axios
        .post("/friend/update/relation", {
          idRelation: relation.id,
          idUser,
          relation: relation.name,
        })
        .catch(({ response: { data: message } }) => setError(message));
    }
  }, [relation]);

  useEffect(() => {
    if (keyWords)
      axios
        .post("/friend/get/people", { idUser, from: 0, keyWords })
        .then(({ data: { friends, isMore } }) => {
          setFriends(friends);
          setStatusOfMore(isMore);
        });
  }, [keyWords]);

  useEffect(() => {
    fetchData(0);
  }, []);

  return (
    <InfiniteScroll
      dataLength={friends.length}
      next={() => fetchData(friends.length)}
      hasMore={isMore}
      loader={<Spinner />}
    >
      <div className="list">
        {friends.map((friend) => {
          const {
            idRelation,
            relation,
            idUser: id,
            firstName,
            lastName,
            photo,
            numberOfFriends,
          } = friend;

          const data = {
            ref: "profile",
            refId: id,
            idRelation,
            photo,
            radiusPhoto: false,
            name: `${firstName + " " + lastName}`,
            description: description,
            number: numberOfFriends,
            button: relation ? "relation" : "join",
            title: t(
              `component:lists.people.${
                relation ? relation.toLowerCase() : "add"
              }`
            ),
            buttonName: relation,
            collapse: relation && idUser == owner.id ? true : false,
            collapseItems: {
              pink: {
                name: "pal",
                title: palName,
              },
              blue: {
                name: "family",
                title: familyName,
              },
              green: {
                name: "friend",
                title: friendName,
              },
            },
          };
          return <Card data={data} key={id} setRelation={setRelation} />;
        })}
      </div>
    </InfiniteScroll>
  );
};

export default People;

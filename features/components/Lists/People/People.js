import React, { useState, useEffect, useContext } from "react";
import Card from "../Card/Card";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import i18next from "@i18n";
import Spinner from "@components/Spinner/Spinner";
import AppContext from "@features/context/AppContext";

const { useTranslation } = i18next;

const People = ({
  listOfPeople = [
    {
      id: 1,
      userId: 2,
      relation: "family",
    },
    {
      id: 2,
      userId: 124,
      relation: "pal",
    },
  ],
  users = {
    2: {
      id: 2,
      firstName: "Jan",
      lastName: "Kowalski",
      photo: "profile.png",
      numberOfFriends: 123,
    },
    124: {
      id: 124,
      firstName: "Jan",
      lastName: "Kowalski",
      photo: "profile.png",
      numberOfFriends: 123,
    },
  },
  idUser,
}) => {
  const { setStatusOfError: setError, owner } = useContext(AppContext);
  const [relation, setRelation] = useState({ id: null, name: "" });
  const [friends, setFriends] = useState([]);
  const [isMore, setStatusOfMore] = useState(false);

  const fetchData = (from) => {
    axios
      .post("/friend/get/people", { idUser: owner.id, from })
      .then(({ data: { friends, isMore } }) => {
        setFriends(friends);
        setStatusOfMore(isMore);
      });
  };

  useEffect(() => {
    if (relation.id != null) console.log(relation);
    axios
      .post("/friend/update/relation", {
        idRelation: relation.id,
        idUser: owner.id,
        relation: relation.name,
      })
      .catch(({ response: { data: message } }) => setError(message));
  }, [relation]);

  useEffect(() => {
    fetchData(0);
  }, []);

  const { t } = useTranslation(["component"]);
  const description = t("component:lists.people.description");
  const friendName = t("component:lists.people.friend");
  const familyName = t("component:lists.people.family");
  const palName = t("component:lists.people.pal");
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
            description: description + ": " + numberOfFriends,
            button: "relation",
            title: t(`component:lists.people.${relation.toLowerCase()}`),
            buttonName: relation,
            collapse: true,
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

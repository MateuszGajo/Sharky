import React, { useState, useEffect, useContext } from "react";
import Card from "../Card/Card";
import axios from "axios";
import i18next from "@i18n";
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
}) => {
  const { setStatusOfError: setError, owner } = useContext(AppContext);
  const [relation, setRelation] = useState({ id: null, name: "" });

  useEffect(() => {
    if (relation.id != null)
      axios
        .post("/friend/update/relation", {
          idRelation: relation.id,
          idUser: owner.id,
          relation: relation.name,
        })
        .catch(({ response: { data: message } }) =>
          setError({ occur: true, message })
        );
  }, [relation]);

  const { t } = useTranslation(["component"]);
  const description = t("component:lists.people.description");
  const friendName = t("component:lists.people.friend");
  const familyName = t("component:lists.people.family");
  const palName = t("component:lists.people.pal");
  return (
    <div className="list">
      {listOfPeople.map((person) => {
        const { userId, relation, id: idRelation } = person;
        const { id, firstName, lastName, photo, numberOfFriends } = users[
          userId
        ];
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
  );
};

export default People;

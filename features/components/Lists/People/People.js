import React, { useState, useEffect } from "react";
import Card from "../Card/Card";
import useTranslation from "next-translate/useTranslation";

const People = ({
  listOfPeople = [
    {
      userId: 123,
      relation: "family",
    },
    {
      userId: 124,
      relation: "pal",
    },
  ],
  users = {
    123: {
      id: 123,
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
  const [updatedRelation, updateRelationShip] = useState(null);

  useEffect(() => {
    //console.log(updatedRelation);
  }, [updatedRelation]);

  const { t } = useTranslation();
  const description = t("component:lists.people.description");
  const friendName = t("component:lists.people.friend");
  const familyName = t("component:lists.people.family");
  const palName = t("component:lists.people.pal");
  return (
    <div className="list">
      {listOfPeople.map((person) => {
        const { userId, relation } = person;
        const { id, firstName, lastName, photo, numberOfFriends } = users[
          userId
        ];
        const data = {
          ref: "profile",
          refId: id,
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
        return (
          <Card data={data} key={id} updateRelation={updateRelationShip} />
        );
      })}
    </div>
  );
};

export default People;

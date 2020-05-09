import React, { useState, useEffect } from "react";
import Card from "../Card/Card";

const People = ({
  listOfPeople = [
    {
      userId: 123,
      relation: "Rodzina",
      numberOfFriends: 123,
    },
    {
      userId: 124,
      relation: "Rodzina",
      numberOfFriends: 123,
    },
  ],
  users = {
    123: {
      id: 123,
      firstName: "Jan",
      lastName: "Kowalski",
      photo: "profile.png",
    },
    124: {
      id: 124,
      firstName: "Jan",
      lastName: "Kowalski",
      photo: "profile.png",
    },
  },
}) => {
  const [updatedRelation, updateRelationShip] = useState(null);

  useEffect(() => {
    //console.log(updatedRelation);
  }, [updatedRelation]);
  return (
    <div className="list">
      {listOfPeople.map((person) => {
        const { userId, relation, numberOfFriends } = person;
        const { id, firstName, lastName, photo } = users[userId];
        const data = {
          ref: "profile",
          refId: id,
          photo,
          radiusPhoto: false,
          name: `${firstName + " " + lastName}`,
          description: "Liczba znajomych: " + numberOfFriends,
          button: "relation",
          title: relation,
          collapse: true,
          collapseItems: {
            pink: "Przyjaciel",
            blue: "Rodzina",
            green: "Znajomy",
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

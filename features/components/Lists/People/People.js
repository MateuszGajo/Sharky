import React, { useState, useEffect } from "react";
import Card from "../Card/Card";

const People = ({
  listOfPeople = [
    {
      userId: 123,
      relation: "Rodzina",
    },
    {
      userId: 124,
      relation: "Rodzina",
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

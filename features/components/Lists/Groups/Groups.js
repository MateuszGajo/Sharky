import React from "react";
import Card from "../Card/Card";
const Groups = ({
  listOfGroups = [
    {
      id: 12,
      name: "dsa",
      photo: "profile.png",
      numberOfMembers: 123,
    },
    {
      id: 12,
      name: "dsa",
      photo: "profile.png",
      numberOfMembers: 123,
    },
    {
      id: 12,
      name: "dsa",
      photo: "profile.png",
      numberOfMembers: 123,
    },
  ],
}) => {
  return (
    <div className="list">
      {listOfGroups.map((group) => {
        const { id, name, photo, numberOfMembers } = group;
        const data = {
          ref: "group",
          refId: id,
          photo,
          radiusPhoto: true,
          name,
          description: "Liczba członków: " + numberOfMembers,
          button: "join",
          title: "Dołącz",
          collapse: false,
        };
        return <Card data={data} key={id} />;
      })}
    </div>
  );
};

export default Groups;

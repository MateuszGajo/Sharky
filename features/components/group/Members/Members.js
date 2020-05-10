import React from "react";
import Card from "../../Lists/Card/Card";

const Members = ({
  members = [
    {
      userId: 123,
      rank: "Członek",
    },
  ],
  users = {
    123: {
      id: 123,
      firstName: "Jan",
      lastName: "Kowalski",
      photo: "profile.png",
    },
  },
}) => {
  return (
    <div className="group-members">
      {members.map((member) => {
        const { userId, rank } = member;
        const { id, firstName, lastName, photo } = users[userId];
        const data = {
          refType: "profile",
          refId: id,
          photo,
          radiusPhoto: false,
          name: `${firstName} ${lastName}`,
          button: "relation",
          title: rank,
          collapse: false,
          collapseItems: {
            pink: "Admin",
            blue: "Moderator",
            green: "Członek",
          },
        };
        return <Card data={data} key={userId} />;
      })}
    </div>
  );
};

export default Members;

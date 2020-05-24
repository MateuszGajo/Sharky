import React from "react";
import Card from "../../Lists/Card/Card";

const Members = ({
  members = [
    {
      userId: 123,
      title: "Użytkownik",
    },
    {
      userId: 124,
      title: "Użytkownik",
    },
    {
      userId: 125,
      title: "Użytkownik",
    },
  ],
  users = {
    123: {
      id: 123,
      firstName: "Janek",
      lastName: "Kowalski",
      photo: "profile.png",
    },
    124: {
      id: 124,
      firstName: "Janek",
      lastName: "Kowalski",
      photo: "profile.png",
    },
    125: {
      id: 125,
      firstName: "Janek",
      lastName: "Kowalski",
      photo: "profile.png",
    },
  },
}) => {
  return (
    <div className="fanpage-members">
      {members.map((member) => {
        const { userId, title } = member;
        const { id, firstName, lastName, photo } = users[userId];

        const data = {
          refType: "profile",
          refId: id,
          photo,
          radiusPhoto: false,
          name: `${firstName} ${lastName}`,
          button: "relation",
          title: title,
          collapse: false,
          collapseItems: {
            green: "Użytkownik",
            blue: "Moderator",
            pink: "Admin",
          },
        };
        return <Card data={data} />;
      })}
    </div>
  );
};

export default Members;

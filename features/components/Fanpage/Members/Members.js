import React from "react";
import useTranslation from "next-translate/useTranslation";
import Card from "../../Lists/Card/Card";

const Members = ({
  members = [
    {
      userId: 123,
<<<<<<< HEAD:features/components/Fanpage/Members/Members.js
      title: "Użytkownik",
    },
    {
      userId: 124,
      title: "Użytkownik",
    },
    {
      userId: 125,
      title: "Użytkownik",
=======
      rank: "member",
    },
    {
      userId: 124,
      rank: "admin",
>>>>>>> features/group:features/components/group/Members/Members.js
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
    124: {
      id: 124,
      firstName: "Jan",
      lastName: "Kowalski",
      photo: "profile.png",
    },
  },
}) => {
  const { t } = useTranslation();

  const adminName = t("group:members.admin");
  const moderatorName = t("group:members.moderator");
  const memberName = t("group:members.member");
  return (
<<<<<<< HEAD:features/components/Fanpage/Members/Members.js
    <div className="fanpage-members">
=======
    <div className="list">
>>>>>>> features/group:features/components/group/Members/Members.js
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
<<<<<<< HEAD:features/components/Fanpage/Members/Members.js
          title: title,
          collapse: false,
          collapseItems: {
            green: "Użytkownik",
            blue: "Moderator",
            pink: "Admin",
=======
          title: t(`group:members.${rank}`),
          buttonName: rank,
          collapse: false,
          collapseItems: {
            pink: {
              name: "admin",
              title: adminName,
            },
            blue: {
              name: "moderator",
              title: moderatorName,
            },
            green: {
              name: "member",
              title: memberName,
            },
>>>>>>> features/group:features/components/group/Members/Members.js
          },
        };
        return <Card data={data} />;
      })}
    </div>
  );
};

export default Members;

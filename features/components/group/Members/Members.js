import React from "react";
import useTranslation from "next-translate/useTranslation";
import Card from "../../Lists/Card/Card";

const Members = ({
  members = [
    {
      userId: 123,
      rank: "member",
    },
    {
      userId: 124,
      rank: "admin",
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
  const { t } = useTranslation();

  const adminName = t("group:members.admin");
  const moderatorName = t("group:members.moderator");
  const memberName = t("group:members.member");
  return (
    <div className="list">
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
          },
        };
        return <Card data={data} key={userId} />;
      })}
    </div>
  );
};

export default Members;

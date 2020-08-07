import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../../Lists/Card/Card";
import i18next from "@i18n";

const { useTranslation } = i18next;

const Members = ({ idGroup }) => {
  const { t } = useTranslation(["group"]);

  const [members, setMembers] = useState([]);

  const adminName = t("group:members.admin");
  const moderatorName = t("group:members.moderator");
  const memberName = t("group:members.member");

  useEffect(() => {
    axios
      .post("/group/member/get", { idGroup })
      .then(({ data: { members } }) => {
        console.log(members);
        setMembers(members);
      });
  }, []);
  return (
    <div className="list">
      {members.map((member) => {
        const { idUser, firstName, lastName, photo, role } = member;
        console.log(role);
        const data = {
          refType: "profile",
          idRef: idUser,
          photo,
          radiusPhoto: false,
          name: `${firstName} ${lastName}`,
          button: "relation",
          title: t(`group:members.${role}`),
          buttonName: role,
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
        return <Card data={data} key={idUser} />;
      })}
    </div>
  );
};

export default Members;

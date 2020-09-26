import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Card from "@components/Lists/Card/Card";
import i18next from "@i18n";
import AppContext from "@features/context/AppContext";

const { useTranslation } = i18next;

const Members = ({
  groupId,
  role: permission,
  setNumberOfMembers,
  numberOfMembers,
}) => {
  const { t } = useTranslation(["group", "component"]);

  const { owner, setError } = useContext(AppContext);

  const [members, setMembers] = useState([]);
  const [removeMember, setRemoveMember] = useState({ id: null, idRef: null });

  const adminName = t("group:members.admin");
  const moderatorName = t("group:members.moderator");
  const memberName = t("group:members.member");
  const yourself = t("component:lists.people.yourself");
  const removeText = t("component:lists.people.remove");

  useEffect(() => {
    const { id, idRef } = removeMember;
    if (id) {
      axios
        .post("/group/user/delete", { subId: id })
        .then(() => {
          const newArrayOfMembers = members.filter(
            (member) => member.userId != idRef
          );
          setMembers(newArrayOfMembers);
          setNumberOfMembers(Number(numberOfMembers) - 1);
        })
        .catch(({ response: { message } }) => setError(message));
    }
  }, [removeMember]);

  useEffect(() => {
    axios
      .post("/group/member/get", { groupId })
      .then(({ data: { members } }) => setMembers(members));
  }, []);

  return (
    <div className="list">
      {members.map((member) => {
        const { subId, userId, firstName, lastName, photo, role } = member;
        const data = {
          refType: "profile",
          id: subId,
          idRef: userId,
          photo,
          unsubTitle: removeText,
          radiusPhoto: false,
          name: `${firstName} ${lastName} ${
            owner.id == userId ? `(${yourself})` : ""
          }`,
          button: "relation",
          title: t(`group:members.${role}`),
          buttonName: role,
          collapse: permission == "admin" && owner.id != userId ? true : false,
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
        return <Card data={data} key={userId} handleClick={setRemoveMember} />;
      })}
    </div>
  );
};

export default Members;

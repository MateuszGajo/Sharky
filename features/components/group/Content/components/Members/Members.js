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
  const deleteText = t("component:lists.people.delete");

  useEffect(() => {
    const { id, refId } = removeMember;
    if (id) {
      axios
        .post("/group/user/delete", { groupId: id, userId: refId })
        .then(() => {
          const newArrayOfMembers = members.filter(
            (member) => member.userId != refId
          );
          setMembers(newArrayOfMembers);
          setNumberOfMembers((prev) => prev - 1);
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
        const { userId, firstName, lastName, photo, role } = member;
        const data = {
          refType: "profile",
          id: groupId,
          refId: userId,
          photo,
          deleteText,
          radiusPhoto: false,
          name: `${firstName} ${lastName} ${
            owner.id == userId ? `(${yourself})` : ""
          }`,
          buttonType: "relation",
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

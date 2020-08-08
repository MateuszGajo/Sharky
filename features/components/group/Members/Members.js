import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Card from "../../Lists/Card/Card";
import i18next from "@i18n";
import AppContext from "@features/context/AppContext";

const { useTranslation } = i18next;

const Members = ({
  idGroup,
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
  const mySelf = t("component:lists.people.my-self");
  const removeText = t("component:lists.people.remove");

  useEffect(() => {
    const { id, idRef } = removeMember;
    if (id) {
      axios
        .post("/group/user/delete", { idSub: id })
        .then(() => {
          console.log("here");
          const newArrayOfMembers = members.filter(
            (member) => member.idUser != idRef
          );
          setMembers(newArrayOfMembers);
          setNumberOfMembers(Number(numberOfMembers) - 1);
        })
        .catch(({ response: { message } }) => setError(message));
    }
  }, [removeMember]);

  useEffect(() => {
    axios
      .post("/group/member/get", { idGroup })
      .then(({ data: { members } }) => setMembers(members));
  }, []);

  return (
    <div className="list">
      {console.log(permission)}
      {console.log(permission == "admin")}
      {members.map((member) => {
        const { idSub, idUser, firstName, lastName, photo, role } = member;
        const data = {
          refType: "profile",
          id: idSub,
          idRef: idUser,
          photo,
          unsubTitle: removeText,
          radiusPhoto: false,
          name: `${firstName} ${lastName} ${
            owner.id == idUser ? `(${mySelf})` : ""
          }`,
          button: "relation",
          title: t(`group:members.${role}`),
          buttonName: role,
          collapse: permission == "admin" && owner.id != idUser ? true : false,
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
        return <Card data={data} key={idUser} handleClick={setRemoveMember} />;
      })}
    </div>
  );
};

export default Members;

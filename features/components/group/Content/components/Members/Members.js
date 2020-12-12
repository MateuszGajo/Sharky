import React, { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import axios from "~features/service/Axios";
import Card from "~components/Lists/Card/Card";
import i18next from "~i18n";
import AppContext from "~features/context/AppContext";

const { useTranslation } = i18next;

const Members = ({ groupId, role: permission, setNumberOfMembers }) => {
  const { t } = useTranslation(["group", "component"]);

  const { owner, setError } = useContext(AppContext);

  const [members, setMembers] = useState([]);
  const [removeMember, setRemoveMember] = useState({ id: null, idRef: null });
  const [relation, setRelation] = useState({});
  const adminName = t("group:members.admin");
  const moderatorName = t("group:members.moderator");
  const memberName = t("group:members.member");
  const yourself = t("component:lists.people.yourself");
  const deleteText = t("component:lists.people.delete");

  useEffect(() => {
    const { id, refId } = removeMember;
    if (id) {
      axios
        .post("/group/user/delete", { subId: refId, groupId })
        .then(() => {
          const newArrayOfMembers = members.filter(
            (member) => member.userId !== id
          );
          setMembers(newArrayOfMembers);
          setNumberOfMembers((prev) => prev - 1);
        })
        .catch(({ response: { message } }) => setError(message));
    }
  }, [removeMember]);

  useEffect(() => {
    const { id, name, setTitle } = relation;

    if (id) {
      axios
        .post("/group/member/relation/change", {
          userId: id,
          groupId,
          relation: name,
        })
        .then(() => {
          setTitle(name);
        })
        .catch(({ response: { message } }) => setError(message));
    }
  }, [relation]);

  useEffect(() => {
    axios
      .post("/group/member/get", { groupId })
      .then(({ data: { members: groupMembers } }) => setMembers(groupMembers));
  }, []);

  return (
    <div className="list">
      {members.map((member) => {
        const { subId, userId, firstName, lastName, photo, role } = member;
        const data = {
          cardInfo: {
            refType: "profile",
            id: userId,
            refId: subId,
            photo,
            deleteText,
            radiusPhoto: false,
            name: `${firstName} ${lastName} ${
              owner.id === userId ? `(${yourself})` : ""
            }`,
          },
          userStatus: {
            relation: role,
          },
          collapse: {
            isCollapse: permission === "admin" && owner.id !== userId,
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
          },
          texts: {
            deleteText,
          },
        };
        return (
          <Card
            data={data}
            key={userId}
            handleCollapseClick={setRemoveMember}
            setRelation={setRelation}
          />
        );
      })}
    </div>
  );
};

Members.propTypes = {
  groupId: PropTypes.number.isRequired,
  role: PropTypes.string.isRequired,
  setNumberOfMembers: PropTypes.func.isRequired,
};

export default Members;

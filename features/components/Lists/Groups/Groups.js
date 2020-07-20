import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Card from "../Card/Card";
import i18next from "@i18n";
import AppContext from "@features/context/AppContext";
const { useTranslation } = i18next;

const Groups = ({
  listOfGroups = [
    {
      id: 12,
      idSub: 5,
      name: "dsa",
      photo: "profile.png",
      numberOfMembers: 123,
    },
    {
      id: 13,
      name: "dsa",
      photo: "profile.png",
      numberOfMembers: 123,
    },
    {
      id: 14,
      name: "dsa",
      photo: "profile.png",
      numberOfMembers: 123,
    },
  ],
}) => {
  const { t } = useTranslation(["component"]);
  const description = t("component:lists.groups.description");
  const buttonJoin = t("component:lists.groups.button-join");
  const buttonLeave = t("component:lists.groups.button-leave");

  const { owner, setStatusOfError: setError } = useContext(AppContext);

  const [group, setGroup] = useState({ id: null, name: "", idSub: null });

  useEffect(() => {
    if (group.idSub)
      axios
        .post("/group/user/delete", { idSub: group.idSub })
        .then(() => group.setIdSub(null))
        .catch(({ response: { data: message } }) => setError(message));
    else if (group.id)
      axios
        .post("/group/user/add", { idUser: owner.id, idGroup: group.id })
        .then(({ data: { id } }) => group.setIdSub(id))
        .catch(({ response: { data: message } }) => setError(message));
  }, [group]);

  return (
    <div className="list">
      {listOfGroups.map((group) => {
        const { id, name, photo, numberOfMembers } = group;
        const data = {
          refType: "group",
          refId: id,
          idSub: group.idSub || null,
          photo,
          radiusPhoto: true,
          name,
          description: description + ": " + numberOfMembers,
          button: "join",
          subTitle: buttonJoin,
          unsubTitle: buttonLeave,
          collapse: false,
        };
        return <Card data={data} key={id} handleClick={setGroup} />;
      })}
    </div>
  );
};

export default Groups;

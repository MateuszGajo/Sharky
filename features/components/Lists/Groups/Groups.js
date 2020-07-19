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
  const buttonText = t("component:lists.groups.button");

  const { owner, setStatusOfError: setError } = useContext(AppContext);

  const [group, setGroup] = useState({ id: null, name: "" });

  useEffect(() => {
    if (group.id)
      axios
        .post("/group/add", { idUser: owner.id, idGroup: group.id })
        .catch(({ reponse: { data: message } }) =>
          setError({ occur: true, message })
        );
  }, [group]);

  return (
    <div className="list">
      {listOfGroups.map((group) => {
        const { id, name, photo, numberOfMembers } = group;
        const data = {
          refType: "group",
          refId: id,
          photo,
          radiusPhoto: true,
          name,
          description: description + ": " + numberOfMembers,
          button: "join",
          title: buttonText,
          collapse: false,
        };
        return <Card data={data} key={id} join={setGroup} />;
      })}
    </div>
  );
};

export default Groups;

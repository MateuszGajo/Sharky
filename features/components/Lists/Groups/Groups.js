import React, { useState, useEffect } from "react";
import Card from "../Card/Card";
import i18next from "@i18n";
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

  const [group, setGroup] = useState("");

  useEffect(() => {
    // console.log(group);
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

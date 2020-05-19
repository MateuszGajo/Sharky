import React from "react";
import Card from "../Card/Card";
import useTranslation from "next-translate/useTranslation";

const Groups = ({
  listOfGroups = [
    {
      id: 12,
      name: "dsa",
      photo: "profile.png",
      numberOfMembers: 123,
    },
    {
      id: 12,
      name: "dsa",
      photo: "profile.png",
      numberOfMembers: 123,
    },
    {
      id: 12,
      name: "dsa",
      photo: "profile.png",
      numberOfMembers: 123,
    },
  ],
}) => {
  const { t } = useTranslation();
  const description = t("component:lists.groups.description");
  const buttonText = t("component:lists.groups.button");
  return (
    <div className="list">
      {listOfGroups.map((group) => {
        const { id, name, photo, numberOfMembers } = group;
        const data = {
          ref: "group",
          refId: id,
          photo,
          radiusPhoto: true,
          name,
          description: description + ": " + numberOfMembers,
          button: "join",
          title: buttonText,
          collapse: false,
        };
        return <Card data={data} key={id} />;
      })}
    </div>
  );
};

export default Groups;

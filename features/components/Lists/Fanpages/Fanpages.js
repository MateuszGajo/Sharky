import React from "react";
import Card from "../Card/Card";
import useTranslation from "next-translate/useTranslation";

const Fanpages = ({
  listOfFanPage = [
    {
      id: 1,
      name: "dassa",
      photo: "profile.png",
      numberOfLikes: 123,
    },
    {
      id: 2,
      name: "dassa",
      photo: "profile.png",
      numberOfLikes: 123,
    },
    {
      id: 3,
      name: "dassa",
      photo: "profile.png",
      numberOfLikes: 123,
    },
  ],
}) => {
  const { t } = useTranslation();
  const description = t("component:lists.fanpages.description");
  const buttonText = t("component:lists.fanpages.button");
  return (
    <div className="list">
      {listOfFanPage.map((fanpage) => {
        const { id, name, photo, numberOfLikes } = fanpage;
        const data = {
          ref: "fanpage",
          refId: id,
          photo,
          radiusPhoto: true,
          name,
          description: description + ": " + numberOfLikes,
          button: "join",
          title: buttonText,
          collapse: false,
        };
        return <Card data={data} key={id} />;
      })}
    </div>
  );
};

export default Fanpages;

import React, { useState, useEffect } from "react";
import Card from "../Card/Card";
import i18next from "../../../../i18n";
const { useTranslation } = i18next;

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
  const { t } = useTranslation(["component"]);
  const description = t("component:lists.fanpages.description");
  const buttonText = t("component:lists.fanpages.button");

  const [fanpage, setFanpage] = useState("");

  useEffect(() => {}, [fanpage]);

  return (
    <div className="list">
      {listOfFanPage.map((fanpage) => {
        const { id, name, photo, numberOfLikes } = fanpage;
        const data = {
          refType: "fanpage",
          refId: id,
          photo,
          radiusPhoto: true,
          name,
          description: description + ": " + numberOfLikes,
          button: "join",
          title: buttonText,
          collapse: false,
        };
        return <Card data={data} key={id} join={setFanpage} />;
      })}
    </div>
  );
};

export default Fanpages;

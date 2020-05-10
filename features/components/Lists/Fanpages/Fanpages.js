import React from "react";
import Card from "../Card/Card";

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
          description: "Liczba subskrypcji: " + numberOfLikes,
          button: "join",
          title: "Dołącz",
          collapse: false,
        };
        return <Card data={data} key={id} />;
      })}
    </div>
  );
};

export default Fanpages;

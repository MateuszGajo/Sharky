import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Card from "../Card/Card";
import i18next from "@i18n";
import AppContext from "@features/context/AppContext";
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

  const { owner, setStatusOfError: setError } = useContext(AppContext);

  const [fanpage, setFanpage] = useState({ id: null, name: "" });

  useEffect(() => {
    if (fanpage.id)
      axios
        .post("/fanpage/add", { idUser: owner.id, idFanpage: fanpage.id })
        .catch(({ reponse: { data: message } }) =>
          setError({ occur: true, message })
        );
  }, [fanpage]);

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

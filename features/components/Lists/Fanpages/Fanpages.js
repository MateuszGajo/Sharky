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
      idSub: 3,
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
  const buttonSubscribe = t("component:lists.fanpages.button-subscribe");
  const buttonUnsubscribe = t("component:lists.fanpages.button-unsubscribe");

  const { owner, setStatusOfError: setError } = useContext(AppContext);

  const [fanpage, setFanpage] = useState({ id: null, name: "", idSub: null });

  useEffect(() => {
    if (fanpage.idSub)
      axios
        .post("/fanpage/user/delete", { idSub: fanpage.idSub })
        .then(() => fanpage.setIdSub(null))
        .catch(({ response: { data: message } }) => setError(message));
    else if (fanpage.id)
      axios
        .post("/fanpage/user/add", { idUser: owner.id, idFanpage: fanpage.id })
        .then(({ data: { id } }) => fanpage.setIdSub(id))
        .catch(({ response: { data: message } }) => setError(message));
  }, [fanpage]);

  return (
    <div className="list">
      {listOfFanPage.map((fanpage) => {
        const { id, name, photo, numberOfLikes } = fanpage;
        const data = {
          refType: "fanpage",
          refId: id,
          idSub: fanpage.idSub || null,
          photo,
          radiusPhoto: true,
          name,
          description: description + ": " + numberOfLikes,
          button: "join",
          subTitle: buttonSubscribe,
          unsubTitle: buttonUnsubscribe,
          collapse: false,
        };
        return <Card data={data} key={id} handleClick={setFanpage} />;
      })}
    </div>
  );
};

export default Fanpages;

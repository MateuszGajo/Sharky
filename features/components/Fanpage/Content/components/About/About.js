import React, { useEffect, useState } from "react";
import axios from "@features/service/Axios";
import i18next from "@i18n";

const { useTranslation } = i18next;

const About = ({ fanpageId }) => {
  const { t } = useTranslation(["fanpage"]);

  const nameText = t("fanpage:name");
  const numberOfSubscribersText = t("fanpage:number-of-subscribers");
  const startingDateText = t("fanpage:starting-date");

  const [data, setData] = useState({
    name: "aa",
    numberOfSubscribers: null,
    date: null,
  });
  const dtf = new Intl.DateTimeFormat("pl", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  const [{ value: da }, , { value: mo }, , { value: ye }] = dtf.formatToParts(
    new Date(data.date)
  );

  useEffect(() => {
    axios
      .post("/fanpage/about", { fanpageId })
      .then(({ data: { fanpageInfo } }) => setData(fanpageInfo));
  }, []);

  return (
    <div className="fanpage-about">
      <div className="fanpage-about__item">
        <div className="fanpage-about__item__property">
          <span className="fanpage-about__item__property__span">
            {nameText}:
          </span>
        </div>
        <div className="fanpage-about__item__name">
          <span className="fanpage-about__item__name__span">{data.name}</span>
        </div>
      </div>
      <div className="fanpage-about__item">
        <div className="fanpage-about__item__property">
          <span className="fanpage-about__item__property__span">
            {numberOfSubscribersText}:
          </span>
        </div>
        <div className="fanpage-about__item__name">
          <span className="fanpage-about__item__name__span">
            {data.numberOfSubscribers}
          </span>
        </div>
      </div>
      <div className="fanpage-about__item">
        <div className="fanpage-about__item__property">
          <span className="fanpage-about__item__property__span">
            {startingDateText}:
          </span>
        </div>
        <div className="fanpage-about__item__name">
          <span className="fanpage-about__item__name__span">
            {da + " " + mo + " " + ye}
          </span>
        </div>
      </div>
    </div>
  );
};

export default About;

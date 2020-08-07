import React, { useEffect, useState } from "react";
import axios from "axios";
import i18next from "@i18n";
const { useTranslation } = i18next;

const About = ({ groupInfo: data }) => {
  const {
    i18n: { language },
  } = useTranslation();

  const dtf = new Intl.DateTimeFormat(language, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  const [{ value: da }, , { value: mo }, , { value: ye }] = dtf.formatToParts(
    new Date(data.date)
  );

  return (
    <div className="group-info">
      <div className="group-info__item">
        <div className="group-info__item__property">
          <span className="group-info__item__property--span">Nazwa</span>
        </div>
        <div className="group-info__item__name">
          <span className="group-info__item__name--span">{data.name}</span>
        </div>
      </div>
      <div className="group-info__item">
        <div className="group-info__item__property">
          <span className="group-info__item__property--span">
            Data Utworzenia
          </span>
        </div>
        <div className="group-info__item__name">
          <span className="group-info__item__name--span">
            {da + " " + mo + " " + ye}
          </span>
        </div>
      </div>
      <div className="group-info__item">
        <div className="group-info__item__property">
          <span className="group-info__item__property--span">
            Liczba członków
          </span>
        </div>
        <div className="group-info__item__name">
          <span className="group-info__item__name--span">
            {data.numberOfMembers}
          </span>
        </div>
      </div>
    </div>
  );
};

export default About;

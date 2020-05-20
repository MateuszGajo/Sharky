import React from "react";
import useTranslation from "next-translate/useTranslation";

const About = ({
  groupInfo = {
    name: "Lorem Ipsum",
    date: new Date("2012-05-15"),
    amountOfMember: 123,
  },
}) => {
  const { lang } = useTranslation();
  const dtf = new Intl.DateTimeFormat(lang, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  const [{ value: da }, , { value: mo }, , { value: ye }] = dtf.formatToParts(
    groupInfo.date
  );
  return (
    <div className="group-info">
      <div className="group-info__item">
        <div className="group-info__item__property">
          <span className="group-info__item__property--span">Nazwa</span>
        </div>
        <div className="group-info__item__name">
          <span className="group-info__item__name--span">{groupInfo.name}</span>
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
            {groupInfo.amountOfMember}
          </span>
        </div>
      </div>
    </div>
  );
};

export default About;

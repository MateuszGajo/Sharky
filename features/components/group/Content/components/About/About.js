import React from "react";
import i18next from "~i18n";
const { useTranslation } = i18next;

const About = ({ startingDate, numberOfMembers, name }) => {
  const {
    i18n: { language },
    t,
  } = useTranslation(["group"]);

  const nameText = t("group:about.name");
  const numberOfMembersText = t("group:about.number-of-members");
  const startingDateText = t("group:about.starting-date");

  const dtf = new Intl.DateTimeFormat(language, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  const [{ value: da }, , { value: mo }, , { value: ye }] = dtf.formatToParts(
    new Date(startingDate)
  );

  return (
    <div className="group-info">
      <div className="group-info__item">
        <div className="group-info__item__property">
          <span className="group-info__item__property__span">{nameText}</span>
        </div>
        <div className="group-info__item__name">
          <span className="group-info__item__name__span">{name}</span>
        </div>
      </div>
      <div className="group-info__item">
        <div className="group-info__item__property">
          <span className="group-info__item__property__span">
            {startingDateText}
          </span>
        </div>
        <div className="group-info__item__name">
          <span className="group-info__item__name__span">
            {da + " " + mo + " " + ye}
          </span>
        </div>
      </div>
      <div className="group-info__item">
        <div className="group-info__item__property">
          <span className="group-info__item__property__span">
            {numberOfMembersText}
          </span>
        </div>
        <div className="group-info__item__name">
          <span className="group-info__item__name__span">
            {numberOfMembers}
          </span>
        </div>
      </div>
    </div>
  );
};

export default About;

import React from "react";

const About = ({
  data = {
    name: "Grupa",
    numberOfMembers: 123,
    date: new Date("2020-10-15"),
  },
}) => {
  const { name, numberOfMembers, date } = data;
  console.log(name);
  const dtf = new Intl.DateTimeFormat("pl", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  const [{ value: da }, , { value: mo }, , { value: ye }] = dtf.formatToParts(
    date
  );

  return (
    <div className="fanpage-about">
      <div className="fanpage-about__item">
        <div className="fanpage-about__item__property">
          <span className="fanpage-about__item__property--span">Nazwa:</span>
        </div>
        <div className="fanpage-about__item__name">
          <span className="fanpage-about__item__name--span">{name}</span>
        </div>
      </div>
      <div className="fanpage-about__item">
        <div className="fanpage-about__item__property">
          <span className="fanpage-about__item__property--span">
            Liczba subskrybentów:
          </span>
        </div>
        <div className="fanpage-about__item__name">
          <span className="fanpage-about__item__name--span">
            {numberOfMembers}
          </span>
        </div>
      </div>
      <div className="fanpage-about__item">
        <div className="fanpage-about__item__property">
          <span className="fanpage-about__item__property--span">
            Data Założenia:
          </span>
        </div>
        <div className="fanpage-about__item__name">
          <span className="fanpage-about__item__name--span">
            {da + " " + mo + " " + ye}
          </span>
        </div>
      </div>
    </div>
  );
};

export default About;

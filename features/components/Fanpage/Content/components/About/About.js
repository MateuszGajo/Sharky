import React, { useEffect, useState } from "react";
import axios from "axios";

const About = ({ idFanpage }) => {
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
      .post("/fanpage/about", { idFanpage })
      .then(({ data: { fanpageInfo } }) => setData(fanpageInfo));
  }, []);

  return (
    <div className="fanpage-about">
      <div className="fanpage-about__item">
        <div className="fanpage-about__item__property">
          <span className="fanpage-about__item__property--span">Nazwa:</span>
        </div>
        <div className="fanpage-about__item__name">
          <span className="fanpage-about__item__name--span">{data.name}</span>
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
            {data.numberOfSubscribers}
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

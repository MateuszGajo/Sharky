import React, { useContext } from "react";
import cx from "classnames";
import { useRouter } from "next/router";
import Button from "./components/Button/Button";
import Description from "./components/Description/Description";
import withCard from "./withCard";
import CardContext from "./context/CardContext";

const Card = () => {
  const { cardInfo } = useContext(CardContext);
  const {
    radiusPhoto,
    refType,
    refId,
    photo,
    noButton,
    textInsteadButton,
  } = cardInfo;
  const router = useRouter();

  const buttonComponent = () => {
    if (!noButton) {
      return (
        <div
          className="card__item__info__second-column__buttons"
          data-testid="card-buttons"
        >
          <Button />
        </div>
      );
    }
    if (textInsteadButton) {
      return (
        <p className="card__item__info__second-column__text">
          {textInsteadButton}
        </p>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="card__item">
        <div className="card__item__photo">
          <img
            src={`/static/images/${photo}`}
            className={cx("card__item__photo__img", {
              "card__item__photo__img--radius": radiusPhoto === true,
            })}
            onClick={() => router.push(`/${refType}/${refId}`)}
            aria-hidden="true"
            data-testid="card-photo"
            alt="card"
          />
        </div>
        <div className="card__item__info">
          <Description />

          <div className="card__item__info__second-column">
            {buttonComponent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withCard(Card);

import React, { useContext } from "react";
import { useRouter } from "next/router";
import CardContext from "../../context/CardContext";

const Description = () => {
  const { cardInfo, number } = useContext(CardContext);
  const { refType, id, name, description } = cardInfo;

  const router = useRouter();
  return (
    <div className="card__item__info__first-column">
      <div className="card__item__info__first-column__name">
        <span
          className="card__item__info__first-column__name__span"
          data-testid="card-name"
          onClick={() => router.push(`/${refType}/${id}`)}
          aria-hidden="true"
        >
          {name}
        </span>
      </div>
      {description ? (
        <div className="card__item__info__first-column__number">
          <span
            className="card__item__info__first-column__number__span"
            data-testid="card-description"
          >
            {`${description}: ${number}`}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default Description;

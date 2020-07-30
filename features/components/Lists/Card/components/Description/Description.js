import React from "react";

const Description = ({ refType, id, name, description, number }) => {
  return (
    <div className="card__item__info__first-column">
      <div className="card__item__info__first-column--name">
        <span
          className="card__item__info__first-column--name--span"
          data-testid="card-name"
          onClick={() => {
            Router.pushRoute(refType, {
              id,
            });
          }}
        >
          {name}
        </span>
      </div>
      {description ? (
        <div className="card__item__info__first-column__number">
          <span
            className="card__item__info__first-column__number--span"
            data-testid="card-description"
          >
            {description + ":" + number}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default Description;

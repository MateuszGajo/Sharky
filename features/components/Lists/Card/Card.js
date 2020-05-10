import React from "react";
import cx from "classnames";
import Router from "../../../routes";

const Card = ({
  data = {
    refType: "profile",
    refId: "123",
    photo: "profile.png",
    radiusPhoto: true,
    name: "Janek Kowalski",
    description: "Coś tam",
    button: "join",
    title: "Przyjaciel",
    collapse: false,
    collapseItems: {
      pink: "Przyjaciel",
      blue: "Rodzina",
      green: "Znajomy",
    },
  },
  updateRelation,
}) => {
  const {
    refType,
    refId,
    photo,
    name,
    description,
    button,
    title,
    collapse,
    collapseItems,
    radiusPhoto,
  } = data;
  return (
    <div className="card">
      <div className="card__item">
        <div className="card__item--picture">
          <img
            src={"/static/images/" + photo}
            className={cx("card__item--picture--img", {
              "card__item--picture--img--radius": radiusPhoto === true,
            })}
            onClick={() => {
              Router.pushRoute(refType, { id: refId });
            }}
            data-testid="card-photo"
          />
        </div>
        <div className="card__item__info">
          <div className="card__item__info__first-column">
            <div className="card__item__info__first-column--name">
              <span
                className="card__item__info__first-column--name--span"
                data-testid="card-name"
                onClick={() => {
                  Router.pushRoute(refType, {
                    id: refId,
                  });
                }}
              >
                {name}
              </span>
            </div>
            {description ? (
              <div className="card__item__info__first-column--amounts-of-friends">
                <span
                  className="card__item__info__first-column--amounts-of-friends--span"
                  data-testid="card-description"
                >
                  {description}
                </span>
              </div>
            ) : null}
          </div>

          <div className="card__item__info__second-column">
            {title ? (
              <div
                className="card__item__info__second-column__buttons"
                data-testid="card-buttons"
              >
                <div
                  className={cx(
                    "card__item__info__second-column__buttons--main-button ",
                    {
                      "card__item__info__second-column__buttons--relation":
                        button === "relation",
                      "card__item__info__second-column__buttons--join":
                        button === "join",
                      "primary-background": collapseItems?.green === title,
                      "family-background": collapseItems?.blue === title,
                      "pal-background": collapseItems?.pink === title,
                    }
                  )}
                  data-testid="card-button"
                >
                  <span
                    className="card__item__info__second-column__buttons--main-button--span"
                    data-testid="card-button-text"
                  >
                    {title}
                  </span>
                </div>
                {collapse ? (
                  <div
                    className="card__item__info__second-column__buttons--change-status"
                    data-testid="card-update-button"
                  >
                    <div
                      className={cx(
                        "card__item__info__second-column__buttons--change-status--circle primary-background",
                        {
                          "brightness-reduce hover-brightness":
                            collapseItems.green !== title,
                        }
                      )}
                      onClick={() => {
                        if (title !== collapseItems.green) {
                          updateRelation({
                            id: refId,
                            name: collapseItems.green,
                          });
                        }
                      }}
                      data-testid="card-relation-button-green"
                    >
                      <span>{collapseItems.green}</span>
                    </div>
                    <div
                      className={cx(
                        "card__item__info__second-column__buttons--change-status--circle pal-background ",
                        {
                          "brightness-reduce hover-brightness":
                            collapseItems.pink !== title,
                        }
                      )}
                      onClick={() => {
                        if (title !== collapseItems.pink) {
                          updateRelation({
                            id: refId,
                            name: collapseItems.pink,
                          });
                        }
                      }}
                      data-testid="card-relation-button-pink"
                    >
                      <span>{collapseItems.pink}</span>
                    </div>
                    <div
                      className={cx(
                        "card__item__info__second-column__buttons--change-status--circle family-background ",
                        {
                          "brightness-reduce hover-brightness":
                            collapseItems.blue !== title,
                        }
                      )}
                      onClick={() => {
                        if (title !== collapseItems.blue) {
                          updateRelation({
                            id: refId,
                            name: collapseItems.blue,
                          });
                        }
                      }}
                      data-testid="card-relation-button-blue"
                    >
                      <span>{collapseItems.blue}</span>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;

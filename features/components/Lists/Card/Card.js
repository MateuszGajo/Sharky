import React, { useContext } from "react";
import cx from "classnames";
import { useRouter } from "next/router";
import Button from "./components/Button/Button";
import Description from "./components/Description/Description";
import AppContext from "@features/context/AppContext";
import i18next from "@i18n";
import withCard from "./withCard";
import CardContext from "./context/CardContext";
const { useTranslation } = i18next;

const Card = () => {
  const { owner } = useContext(AppContext);
  const { cardInfo } = useContext(CardContext);
  const { radiusPhoto, refType, id, photo, isNotButton } = cardInfo;
  const { t } = useTranslation();

  const yourself = t("component:lists.people.yourself");

  const router = useRouter();

  return (
    <div className="card">
      <div className="card__item">
        <div className="card__item__photo">
          <img
            src={"/static/images/" + photo}
            className={cx("card__item__photo__img", {
              "card__item__photo__img--radius": radiusPhoto === true,
            })}
            onClick={() => router.push(`/${refType}/${id}`)}
            data-testid="card-photo"
          />
        </div>
        <div className="card__item__info">
          <Description />

          <div className="card__item__info__second-column">
            {!isNotButton ? (
              <div
                className="card__item__info__second-column__buttons"
                data-testid="card-buttons"
              >
                {owner.id == id ? (
                  <span className="card__item__info__second-column__buttons--yourself">
                    ({yourself})
                  </span>
                ) : (
                  <Button invitationType="accept" />
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withCard(Card);

import React, { useContext } from "react";
import cx from "classnames";
import axios from "axios";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/router";
import i18next from "@i18n";
import AppContext from "@features/context/AppContext";
const { useTranslation } = i18next;

const Item = ({ item, setDeleteNotification }) => {
  const {
    id,
    idSubscribe,
    idGroup,
    idUser,
    date,
    name,
    photo,
    firstName,
    lastName,
    relation,
    idRelation,
    newRelation,
  } = item;

  const { t } = useTranslation(["notifications"]);
  const router = useRouter();

  const { setError } = useContext(AppContext);

  const groupInvite = t("notifications:group-invite");
  const changeRelation = t("notifications:relation-change");

  const acceptNewRelation = () => {
    axios
      .post("/friend/change/relation/accept", { newRelation, idRelation })
      .then(() => setDeleteNotification({ id }))
      .catch(({ response: { data: message } }) => setError(message));
  };
  const declineNewRelation = () => {
    axios
      .post("/friend/change/relation/decline", { idRelation })
      .then(() => setDeleteNotification({ id }))
      .catch(({ response: { data: message } }) => setError(message));
  };
  const acceptInvitationToGroup = () => {
    axios
      .post("/group/user/invitation/accept", { idSubscribe })
      .then(() => setDeleteNotification({ id }))
      .catch(({ response: { data: message } }) => setError(message));
  };
  const declineInvitationToGroup = () => {
    axios
      .post("/group/user/invitation/decline", { idSubscribe })
      .then(() => setDeleteNotification({ id }))
      .catch(({ response: { data: message } }) => setError(message));
  };

  return (
    <div className="home-wrapper__main__content__notifications">
      <div
        className="home-wrapper__main__content__notifications__item"
        onClick={() =>
          router.push(
            `/${idUser ? "user" : "group"}/${idUser ? idUser : idGroup}`
          )
        }
      >
        <div className="home-wrapper__main__content__notifications__item__photo">
          <img
            src={"/static/images/" + photo}
            alt=""
            className="home-wrapper__main__content__notifications__item__photo--img"
          />
        </div>
        <div className="home-wrapper__main__content__notifications__item__content">
          <div className="home-wrapper__main__content__notifications__item__content--name">
            <span
              className={cx(
                "home-wrapper__main__content__notifications__item__content--name--span bold-text",
                {
                  "pal-color": relation == "pal",
                  "family-color": relation == "family",
                  "primary-color": relation == "friend",
                }
              )}
            >
              {idUser ? firstName + " " + lastName : name}
            </span>
          </div>
          <div className="home-wrapper__main__content__notifications__item__content--text">
            <span className="home-wrapper__main__content__notifications__item__content--text--span">
              {idUser && (
                <span className="bold-text">
                  {firstName + " " + lastName + " "}
                </span>
              )}
              {(idUser ? changeRelation : groupInvite) + " "}
              <span
                className={cx("bold-text", {
                  "pal-color": newRelation == "pal",
                  "family-color": newRelation == "family",
                  "primary-color": newRelation == "friend",
                })}
              >
                {idUser ? newRelation : name}
              </span>
            </span>
          </div>
        </div>
        <div className="home-wrapper__main__content__notifications__item__content__buttons">
          <div
            className="home-wrapper__main__content__notifications__item__content__buttons__accept"
            onClick={(e) => {
              e.stopPropagation();
              if (idUser) acceptNewRelation();
              else if (idGroup) acceptInvitationToGroup();
            }}
          >
            <AiOutlineCheck />
          </div>
          <div
            className="home-wrapper__main__content__notifications__item__content__buttons__decline"
            onClick={(e) => {
              e.stopPropagation();
              if (idUser) declineNewRelation();
              else if (idGroup) declineInvitationToGroup();
            }}
          >
            <AiOutlineClose />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;

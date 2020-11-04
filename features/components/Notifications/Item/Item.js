import React, { useContext } from "react";
import PropTypes from "prop-types";
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
    subscribeId,
    groupId,
    userId,
    friendshipId,
    name,
    photo,
    firstName,
    lastName,
    relation,
    newRelation,
  } = item;
  const { t } = useTranslation(["notifications"]);
  const router = useRouter();

  const { setError } = useContext(AppContext);

  const groupInvite = t("notifications:group-invite");
  const changeRelation = t("notifications:relation-change");

  const acceptNewRelation = () => {
    axios
      .post("/friend/change/relation/accept", {
        newRelation,
        friendshipId,
        userId,
      })
      .then(() => setDeleteNotification({ id }))
      .catch(({ response: { data: message } }) => setError(message));
  };
  const declineNewRelation = () => {
    axios
      .post("/friend/change/relation/decline", { friendshipId, userId })
      .then(() => setDeleteNotification({ id }))
      .catch(({ response: { data: message } }) => setError(message));
  };
  const acceptInvitationToGroup = () => {
    axios
      .post("/group/user/invitation/accept", { subscribeId })
      .then(() => setDeleteNotification({ id }))
      .catch(({ response: { data: message } }) => setError(message));
  };
  const declineInvitationToGroup = () => {
    axios
      .post("/group/user/invitation/decline", { subscribeId })
      .then(() => setDeleteNotification({ id }))
      .catch(({ response: { data: message } }) => setError(message));
  };

  return (
    <div className="home-wrapper__main__content__notifications">
      <div
        className="home-wrapper__main__content__notifications__item"
        onClick={() =>
          router.push(
            `/${userId ? "user" : "group"}/${userId ? userId : groupId}`
          )
        }
      >
        <div className="home-wrapper__main__content__notifications__item__photo">
          <img
            src={"/static/images/" + photo}
            alt=""
            className="home-wrapper__main__content__notifications__item__photo__img"
          />
        </div>
        <div className="home-wrapper__main__content__notifications__item__content">
          <div className="home-wrapper__main__content__notifications__item__content__name">
            <span
              className={cx(
                "home-wrapper__main__content__notifications__item__content__name__span bold-text",
                {
                  "pal-color": relation == "pal",
                  "family-color": relation == "family",
                  "primary-color": relation == "friend",
                }
              )}
            >
              {userId ? firstName + " " + lastName : name}
            </span>
          </div>
          <div className="home-wrapper__main__content__notifications__item__content__text">
            <span className="home-wrapper__main__content__notifications__item__content__text__span">
              {userId && (
                <span className="bold-text">
                  {firstName + " " + lastName + " "}
                </span>
              )}
              {(userId ? changeRelation : groupInvite) + " "}
              <span
                className={cx("bold-text", {
                  "pal-color": newRelation == "pal",
                  "family-color": newRelation == "family",
                  "primary-color": newRelation == "friend",
                })}
              >
                {userId ? newRelation : name}
              </span>
            </span>
          </div>
        </div>
        <div className="home-wrapper__main__content__notifications__item__content__buttons">
          <div
            className="home-wrapper__main__content__notifications__item__content__buttons__accept"
            onClick={(e) => {
              e.stopPropagation();
              if (userId) acceptNewRelation();
              else if (groupId) acceptInvitationToGroup();
            }}
          >
            <AiOutlineCheck />
          </div>
          <div
            className="home-wrapper__main__content__notifications__item__content__buttons__decline"
            onClick={(e) => {
              e.stopPropagation();
              if (userId) declineNewRelation();
              else if (groupId) declineInvitationToGroup();
            }}
          >
            <AiOutlineClose />
          </div>
        </div>
      </div>
    </div>
  );
};

Item.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    subscribeId: PropTypes.number,
    groupId: PropTypes.number,
    userId: PropTypes.number,
    friendshipId: PropTypes.number,
    name: PropTypes.string,
    photo: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    relation: PropTypes.string,
    newRelation: PropTypes.string,
  }),
  setDeleteNotification: PropTypes.func,
};

export default Item;

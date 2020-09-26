import React, { useState, useRef, useEffect, useContext } from "react";
import cx from "classnames";
import { useRouter } from "next/router";
import Collapse from "./components/Collapse/Collapse";
import Button from "./components/Button/Button";
import Description from "./components/Description/Description";
import AppContext from "@features/context/AppContext";
import i18next from "@i18n";
const { useTranslation } = i18next;

const Card = ({ data, setRelation, handleClick, setInvite }) => {
  const {
    refType,
    id,
    photo,
    name,
    description,
    number: initialNumber,
    button: btn,
    isInvited,
    isInvitationSent,
    acceptInvite,
    declineInvite,
    inviteSent,
    subTitle = null,
    unsubTitle,
    title: initialTitle,
    buttonName: btnName,
    collapse: initialCollapse,
    collapseItems = null,
    radiusPhoto,
  } = data;
  const { green: greenC, blue: blueC, pink: pinkC } = collapseItems || {};

  const { owner } = useContext(AppContext);
  const { t } = useTranslation();

  const yourself = t("component:lists.people.yourself");

  const router = useRouter();

  const [idRef, setIdRef] = useState(data.idRef);
  const [inviteType, setInviteType] = useState(isInvited ? "accept" : "");

  const [button, setButton] = useState(btn);
  const [buttonName, setButtonName] = useState(btnName);
  const [title, setTitle] = useState(initialTitle);
  const [collapse, setCollapse] = useState(initialCollapse);
  const [number, setNumber] = useState(initialNumber);

  const collapseRef = useRef(null);

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
          <Description
            id={id}
            refType={refType}
            name={name}
            description={description}
            number={number}
          />

          <div className="card__item__info__second-column">
            {button ? (
              <div
                className="card__item__info__second-column__buttons"
                data-testid="card-buttons"
              >
                {owner.id == id ? (
                  <span className="card__item__info__second-column__buttons--yourself">
                    ({yourself})
                  </span>
                ) : (
                  <Button
                    button={button}
                    setButton={setButton}
                    greenName={greenC?.name}
                    pinkName={pinkC?.name}
                    blueName={blueC?.name}
                    buttonName={buttonName}
                    setButtonName={setButtonName}
                    collapseItems={collapseItems}
                    handleClick={handleClick}
                    idRef={idRef}
                    setIdRef={setIdRef}
                    id={id}
                    refType={refType}
                    number={number}
                    setNumber={setNumber}
                    title={!title ? (idRef ? unsubTitle : subTitle) : title}
                    setTitle={setTitle}
                    collapse={collapse}
                    isInvited={isInvited}
                    isInvitationSent={isInvitationSent}
                    setCollapse={setCollapse}
                    subTitle={subTitle}
                    unsubTitle={unsubTitle}
                    inviteType={inviteType}
                    setInviteType={setInviteType}
                    acceptInvite={acceptInvite}
                    declineInvite={declineInvite}
                    inviteSent={inviteSent}
                    setInvite={setInvite}
                    collapseRef={collapseRef}
                  />
                )}
                {inviteType && (
                  <Button
                    button={button}
                    greenName={greenC?.name}
                    pinkName={pinkC?.name}
                    blueName={blueC?.name}
                    buttonName={buttonName}
                    collapseItems={collapseItems}
                    handleClick={handleClick}
                    idRef={idRef}
                    setIdRef={setIdRef}
                    id={id}
                    refType={refType}
                    setNumber={setNumber}
                    title={!title ? (idRef ? unsubTitle : subTitle) : title}
                    collapse={collapse}
                    unsubTitle={unsubTitle}
                    inviteType={"decline"}
                    acceptInvite={acceptInvite}
                    declineInvite={declineInvite}
                    setInvite={setInvite}
                  />
                )}
                {collapse ? (
                  <Collapse
                    id={id}
                    idRef={idRef}
                    setButtonName={setButtonName}
                    setTitle={setTitle}
                    buttonName={buttonName}
                    greenName={greenC.name}
                    greenTitle={greenC.title}
                    pinkName={pinkC.name}
                    pinkTitle={pinkC.title}
                    blueName={blueC.name}
                    blueTitle={blueC.title}
                    setRelation={setRelation}
                    collapseRef={collapseRef}
                  />
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

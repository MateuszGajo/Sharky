import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import AddFriendButton from "@common/Buttons/AddFriendButton/AddFriendButton";
import FriendInvitedButton from "@common/Buttons/FriendInvitedButton/FriendInvitedButton";
import FriendsInvitationButtons from "@common/Buttons/FriendsInvitationButtons/FriendsInvitationButtons";
import RelationButtons from "@common/Buttons/RelationButtons/RelationButtons";
import JoinLeaveButton from "@common/Buttons/JoinLeaveButton/JoinLeaveButton";
import CardContext from "../../context/CardContext";
import getInitialButtonName from "./getInitialButtonName";

const Button = () => {
  const {
    cardInfo,
    userStatus,
    collapse,
    texts,
    setRelation,
    setDeclineInvitation,
    handleCollapseClick,
    handleClick,
    setNumber,
    refId,
    setRefId,
  } = useContext(CardContext);

  const { collapseItems } = collapse;
  const { id } = cardInfo;
  const { subTitle, unsubTitle } = texts || {};
  const initialButtonName = getInitialButtonName({
    ...userStatus,
    subTitle,
  });

  const [currentRelation, setCurrentRelation] = useState(userStatus?.relation);
  const [buttonName, setButtonName] = useState(initialButtonName);

  const renderComponent = (name) => {
    switch (name) {
      case "add":
        return (
          <AddFriendButton
            userId={id}
            setButtonName={setButtonName}
            icon={false}
            border={true}
            size="small"
            invitePerson={userStatus.invitePerson}
          />
        );
      case "invitation":
        return <FriendInvitedButton size="small" border={true} />;
      case "friendRequest":
        return (
          <FriendsInvitationButtons
            userId={id}
            setButtonName={setButtonName}
            setCurrentRelation={setCurrentRelation}
            size="small"
            darkerBorder={false}
            setDeclineInvitation={setDeclineInvitation}
          />
        );
      case "relation":
        return (
          <RelationButtons
            buttons={collapseItems}
            userId={id}
            refId={refId}
            title={currentRelation}
            blockCollapse={!collapse.isCollapse}
            setButtonName={setButtonName}
            setRelation={setRelation}
            handleCollapseClick={handleCollapseClick}
            setNumber={setNumber}
            setRefId={setRefId}
            deleteTitle={texts.deleteText}
            size="small"
          />
        );
      case "joinLeave":
        return (
          <JoinLeaveButton
            id={id}
            refId={refId}
            joinText={subTitle}
            leaveText={unsubTitle}
            size="small"
            onClick={handleClick}
            setNumber={setNumber}
            setRefId={setRefId}
          />
        );
    }
  };

  return (
    <div className="card__item__info__second-column__buttons__main-button">
      {renderComponent(buttonName)}
    </div>
  );
};
const element = typeof Element === "undefined" ? function () {} : Element;
Button.propTypes = {
  collapseRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(element) }),
  ]),
  title: PropTypes.string,
  invitationType: PropTypes.string,
};

export default Button;

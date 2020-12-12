import React, { useState, useContext } from "react";
import AddFriendButton from "~common/Buttons/AddFriendButton/AddFriendButton";
import FriendInvitedButton from "~common/Buttons/FriendInvitedButton/FriendInvitedButton";
import FriendsInvitationButtons from "~common/Buttons/FriendInvitationButtons/FriendInvitationButtons";
import RelationButtons from "~common/Buttons/RelationButtons/RelationButtons";
import JoinLeaveButton from "~common/Buttons/JoinLeaveButton/JoinLeaveButton";
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
  const [blockCollapse, setBlockCollapse] = useState(!collapse.isCollapse);

  const renderComponent = (name) => {
    switch (name) {
      case "add":
        return (
          <AddFriendButton
            userId={id}
            setButtonName={setButtonName}
            icon={false}
            border
            size="small"
            invitePerson={userStatus.invitePerson}
          />
        );
      case "invitation":
        return <FriendInvitedButton size="small" border />;
      case "friendRequest":
        return (
          <FriendsInvitationButtons
            userId={id}
            setButtonName={setButtonName}
            setCurrentRelation={setCurrentRelation}
            setBlockCollapse={setBlockCollapse}
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
            blockCollapse={blockCollapse}
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
      default:
        return null;
    }
  };

  return (
    <div className="card__item__info__second-column__buttons__main-button">
      {renderComponent(buttonName)}
    </div>
  );
};

export default Button;

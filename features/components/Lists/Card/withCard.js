import React, { useState } from "react";
import CardContext from "./context/CardContext";

const withCard = (WrappedComponent) => {
  return (props) => {
    const { data, setRelation, handleClick, setInvite } = props;
    const {
      refType,
      refId: initialRefId,
      id,
      photo,
      name,
      description,
      number: initialNumber,
      buttonType: initialButtonType,
      isInvited: initialIsInvited,
      isInvitationSent,
      title: initialTitle,
      buttonName: btnName,
      collapse: initialCollapse,
      collapseItems = null,
      radiusPhoto,
      deleteText,
      secondTitle,
    } = data;

    const [refId, setRefId] = useState(initialRefId);

    const [buttonType, setButtonType] = useState(initialButtonType);
    const [buttonName, setButtonName] = useState(btnName);
    const [collapse, setCollapse] = useState(initialCollapse);
    const [number, setNumber] = useState(initialNumber);
    const [title, setTitle] = useState(initialTitle);
    const [isInvited, setStatusOfInvited] = useState(initialIsInvited);

    return (
      <CardContext.Provider
        value={{
          id,
          photo,
          name,
          description,
          isInvitationSent,
          collapseItems,
          radiusPhoto,
          refType,
          refId,
          setRefId,
          buttonType,
          setButtonType,
          buttonName,
          setButtonName,
          title,
          setTitle,
          collapse,
          setCollapse,
          number,
          setNumber,
          setRelation,
          handleClick,
          setInvite,
          isInvited,
          deleteText,
          setStatusOfInvited,
          secondTitle,
        }}
      >
        <WrappedComponent {...props} />
      </CardContext.Provider>
    );
  };
};

export default withCard;

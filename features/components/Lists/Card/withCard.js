import React, { useState } from "react";
import PropTypes from "prop-types";
import CardContext from "./context/CardContext";

const withCard = (Component) => {
  const Wrapped = (props) => {
    const {
      data,
      setRelation,
      handleClick,
      handleCollapseClick,
      setInvite,
    } = props;
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
      subTitle,
      unsubTitle,
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
          subTitle,
          unsubTitle,
          handleCollapseClick,
        }}
      >
        <Component {...props} />
      </CardContext.Provider>
    );
  };

  Wrapped.propTypes = {
    data: PropTypes.shape({
      id: PropTypes.number,
      refId: PropTypes.number,
      refType: PropTypes.string.isRequired,
      photo: PropTypes.string.isRequired,
      isInvited: PropTypes.bool,
      isInvitationSent: PropTypes.bool,
      radiusPhoto: PropTypes.bool,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      number: PropTypes.number,
      buttonType: PropTypes.string,
      title: PropTypes.string,
      secondTitle: PropTypes.string,
      subTitle: PropTypes.string,
      unsubTitle: PropTypes.string,
      deleteText: PropTypes.string,
      buttonName: PropTypes.string,
      collapse: PropTypes.bool,
      collapseItems: PropTypes.shape({
        pink: PropTypes.shape({
          name: PropTypes.string,
          title: PropTypes.string,
        }),
        blue: PropTypes.shape({
          name: PropTypes.string,
          title: PropTypes.string,
        }),
        green: PropTypes.shape({
          name: PropTypes.string,
          title: PropTypes.string,
        }),
      }),
    }),
    setRelation: PropTypes.func,
    handleClick: PropTypes.func,
    setInvite: PropTypes.func,
  };

  return Wrapped;
};

export default withCard;

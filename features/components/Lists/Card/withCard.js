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
      setDeclineInvitation,
    } = props;
    const { cardInfo, userStatus, collapse, texts } = data;

    const [refId, setRefId] = useState(cardInfo.refId);
    const [number, setNumber] = useState(cardInfo.number);

    return (
      <CardContext.Provider
        value={{
          cardInfo,
          userStatus,
          collapse,
          texts,
          refId,
          number,
          setRefId,
          setNumber,
          setRelation,
          handleClick,
          handleCollapseClick,
          setDeclineInvitation,
        }}
      >
        <Component {...props} />
      </CardContext.Provider>
    );
  };

  Wrapped.defaultProps = {
    setRelation: () => {},
    handleClick: () => {},
    setInvite: () => {},
    setDeclineInvitation: () => {},
    handleCollapseClick: () => {},
  };

  Wrapped.propTypes = {
    data: PropTypes.shape({
      cardInfo: PropTypes.shape({
        id: PropTypes.number,
        refId: PropTypes.number,
        refType: PropTypes.string.isRequired,
        photo: PropTypes.string.isRequired,
        radiusPhoto: PropTypes.bool,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        number: PropTypes.number,
        noButton: PropTypes.bool,
      }).isRequired,
      userStatus: PropTypes.shape({
        isInvited: PropTypes.bool,
        isInvitationSent: PropTypes.bool,
        relation: PropTypes.string,
        invitePerson: PropTypes.string,
      }),
      collapse: PropTypes.shape({
        isCollapse: PropTypes.bool,
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
      texts: PropTypes.shape({
        subTitle: PropTypes.string,
        unsubTitle: PropTypes.string,
        deleteText: PropTypes.string,
      }),
    }).isRequired,
    setRelation: PropTypes.func,
    handleClick: PropTypes.func,
    setInvite: PropTypes.func,
    setDeclineInvitation: PropTypes.func,
    handleCollapseClick: PropTypes.func,
  };

  return Wrapped;
};

export default withCard;

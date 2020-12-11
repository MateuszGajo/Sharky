import React from "react";
import PropTypes from "prop-types";

export const WizzardContext = React.createContext({
  isMessengerClose: true,
  setStatusOfMessenger: () => {},
  postContent: "",
  setPostContent: () => {},
  chat: { user: {}, chatId: null },
  setChat: () => {},
});

WizzardContext.Provider.propTypes = {
  value: PropTypes.shape({
    isMessengerClose: PropTypes.bool,
    setStatusOfMessenger: PropTypes.func,
    postContent: PropTypes.string,
    setPostContent: PropTypes.func,
    chat: PropTypes.shape({
      user: PropTypes.shape({
        id: PropTypes.number,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        photo: PropTypes.string,
      }),
      chatId: PropTypes.number,
    }),
    setChat: PropTypes.func,
  }),
};

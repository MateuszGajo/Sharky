import React from "react";

export default React.createContext({
  socket: null,
  owner: {},
  newMessage: {},
  isError: "",
  isPrompt: "",
  setPrompt: () => {},
  setError: () => {},
  newChat: {
    userID: null,
    chatID: null,
    messageTo: null,
    firstName: "",
    lastName: "",
    photo: "",
  },
  setNewChat: () => {},
});

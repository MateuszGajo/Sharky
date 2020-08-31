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
    idUser: null,
    idChat: null,
    messageTo: null,
    firstName: "",
    lastName: "",
    photo: "",
  },
  setNewChat: () => {},
  isAuth: null,
  setStatusOfAuth: () => {},
});

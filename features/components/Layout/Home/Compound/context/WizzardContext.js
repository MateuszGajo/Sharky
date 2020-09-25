import React from "react";

export const WizzardContext = React.createContext({
  isMessengerClose: true,
  setStatusOfMessenger: () => {},
  postContent: "",
  setPostContent: () => {},
  chat: { user: {}, chatId: null },
  setChat: () => {},
});

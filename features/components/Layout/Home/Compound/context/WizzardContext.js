import React from "react";

export const WizzardContext = React.createContext({
  isMessengerClose: true,
  setStatusOfMessenger: () => {},
  searchContent: "",
  setSearchContent: () => {},
  postContent: "",
  setPostContent: () => {},
});

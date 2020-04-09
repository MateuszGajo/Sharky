import React from "react";

export const WizzardContext = React.createContext({
  isMessage: false,
  setStatusOfMessage: () => {},
  searchContent: "",
  setSearchContent: () => {},
  postContent: "",
  setPostContent: () => {},
});

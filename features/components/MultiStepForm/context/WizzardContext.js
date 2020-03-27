import React from "react";

export const WizzardContext = React.createContext({
  numberOfPages: 0,
  setNumberOfPages: () => {},
  page: 1,
  setPage: () => {}
});

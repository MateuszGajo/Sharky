import React from "react";

export const GlobalContext = React.createContext({
  authError: "",
  authUserError: "",
  signIn: () => {},
});

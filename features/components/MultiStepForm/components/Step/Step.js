import React, { useContext } from "react";
import { WizzardContext } from "../../context/WizzardContext";

const Step = ({ children, pageIndex }) => {
  const { page } = useContext(WizzardContext);

  return pageIndex === page ? children : null;
};

export default Step;

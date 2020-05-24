import React, { useContext, useEffect } from "react";
import { WizzardContext } from "../../context/WizzardContext";
const StepWrapper = ({ children }) => {
  const { setNumberOfPages } = useContext(WizzardContext);

  let amountOfPages = 0;
  children = children.map(item => {
    if (item.props.dataKey === "Step") {
      amountOfPages++;
      return React.cloneElement(item, {
        pageIndex: amountOfPages,
        key: amountOfPages
      });
    }
    return item;
  });

  useEffect(() => {
    setNumberOfPages(amountOfPages);
  }, []);

  return children;
};

export default StepWrapper;

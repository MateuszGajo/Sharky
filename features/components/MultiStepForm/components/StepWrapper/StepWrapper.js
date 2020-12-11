import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { WizzardContext } from "../../context/WizzardContext";

const StepWrapper = ({ children }) => {
  const { setNumberOfPages } = useContext(WizzardContext);

  let amountOfPages = 0;
  const childrenCloned = children.map((item) => {
    if (item.props.dataKey === "Step") {
      amountOfPages += 1;
      return React.cloneElement(item, {
        pageIndex: amountOfPages,
        key: amountOfPages,
      });
    }
    return item;
  });

  useEffect(() => {
    setNumberOfPages(amountOfPages);
  }, []);

  return childrenCloned;
};

StepWrapper.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
};

export default StepWrapper;

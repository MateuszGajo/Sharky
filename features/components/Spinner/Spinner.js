import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
const Spinner = () => {
  return (
    <div className="spinner">
      <ClipLoader size={150} color={"#21bf73"} loading={true} />
    </div>
  );
};

export default Spinner;

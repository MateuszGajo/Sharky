import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types"
import AppContext from "@features/context/AppContext";

const Prompt = ({ message }) => {
  const { setPrompt } = useContext(AppContext);

  useEffect(() => {
    const hidePopUp = setTimeout(() => {
      setPrompt("");
    }, [2500]);

    return () => {
      clearTimeout(hidePopUp);
    };
  }, []);
  return (
    <section className="prompt">
      <div className="prompt__container">
        <span className="prompt__cotaniner__message">{message}</span>
      </div>
    </section>
  );
};

Prompt.propTypes = {
  message: PropTypes.string
}

export default Prompt;

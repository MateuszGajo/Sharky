import React from "react";
import Authentication from "../features/components/Layout/Authentication/Authentication";
const SignIn = () => {
  return (
    <Authentication>
      <>
        <div className="authentication__form__wrapper__icons">
          <div className="authentication__form__wrapper__icons--icon"></div>
          <div className="authentication__form__wrapper__icons--icon"></div>
          <div className="authentication__form__wrapper__icons--icon"></div>
        </div>
      </>
    </Authentication>
  );
};

export default SignIn;

import React, { useEffect, useContext, useState } from "react";
import Router from "next/router";
import Authentication from "../features/components/Layout/Authentication/Authentication";
import * as MultiStepForm from "../features/components/MultiStepForm/MultiStepForm";
import PopUpHandlers from "~components/PopUpHandlers/PopUpHandlers";
import Spinner from "~components/Spinner/Spinner";
import AppContext from "~features/context/AppContext";
import { getOwner } from "~features/service/Functions/index";
import "../styles/signup.scss";

const SignUp = () => {
  const { setOwner } = useContext(AppContext);
  const [isAuth, setStatusOfAuth] = useState(null);

  useEffect(() => {
    getOwner({ setStatusOfAuth, setOwner });
  }, []);
  if (isAuth === null) return <Spinner />;
  if (isAuth) {
    Router.push("/");
    return <Spinner />;
  }
  return (
    <Authentication type="signup">
      <PopUpHandlers />
      <MultiStepForm.Wizzard>
        <MultiStepForm.StepWrapper>
          <MultiStepForm.Step dataKey="Step">
            <MultiStepForm.Credentials />
          </MultiStepForm.Step>
          <MultiStepForm.Step dataKey="Step">
            <MultiStepForm.PersonalData />
          </MultiStepForm.Step>
        </MultiStepForm.StepWrapper>
        <MultiStepForm.Controls />
      </MultiStepForm.Wizzard>
    </Authentication>
  );
};

export default SignUp;

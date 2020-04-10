import React from "react";
import Authentication from "../features/components/Layout/Authentication/Authentication/Authentication";
import * as MultiStepForm from "../features/components/MultiStepForm/MultiStepForm";
import "./styles/main.scss";

const SignUp = ({ onSubmit }) => {
  return (
    <Authentication type="signup">
      <MultiStepForm.Wizzard onSubmit={onSubmit}>
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

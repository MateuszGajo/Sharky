import React from "react";
import Authentication from "../features/components/Layout/Authentication/Authentication";
import * as MultiStepForm from "../features/components/MultiStepForm/MultiStepForm";
const SignUp = () => {
  return (
    <Authentication>
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

import React from "react";
import { render } from "@testing-library/react";
import PrimaryButton from "../PrimaryButton";
import {
  toHaveClass,
  toHaveTextContent,
} from "@testing-library/jest-dom/matchers";

expect.extend({ toHaveClass, toHaveTextContent });

it("test primary button property", () => {
  const textButton = "Akceptuj";
  const { getByTestId } = render(
    <PrimaryButton
      size="large"
      border={true}
      value={textButton}
      isDisable={true}
      link="/home"
    />
  );
  const primaryButton = getByTestId("primary-button");

  expect(primaryButton).toHaveClass(
    "primary-button--large primary-button--border is-close"
  );

  expect(primaryButton.firstChild).toHaveTextContent(textButton);
});

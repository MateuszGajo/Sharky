import React from "react";
import { render, fireEvent } from "@testing-library/react";
import {
  toHaveTextContent,
  toHaveValue,
  toHaveClass,
} from "@testing-library/jest-dom/matchers";
import AuthInput from "../authInput";

expect.extend({ toHaveTextContent, toHaveValue, toHaveClass });

it("does auth input property works correct", () => {
  const inputValue = "e-mail";
  const inputTitle = "E-mail";
  const inputOnChange = jest.fn();
  const { getByTestId } = render(
    <AuthInput
      value={inputValue}
      title={inputTitle}
      onChange={inputOnChange}
      size="large"
    />
  );

  const authInput = getByTestId("auth-input");
  const authInputContainer = getByTestId("auth-input");
  const authInputLabel = getByTestId("auth-input-placeholder");

  expect(authInputLabel).toHaveTextContent(inputTitle);
  expect(authInput).toHaveValue(inputValue);
  expect(authInputContainer).toHaveClass("auth-input--large");

  const newInputValue = "e-mail2";
  fireEvent.change(authInput, {
    target: { value: newInputValue },
  });

  expect(inputOnChange).toHaveBeenCalledWith(newInputValue);
});

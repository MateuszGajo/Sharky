import React from "react";
import { render, fireEvent } from "@testing-library/react";
import InputAuth from "../InputAuth";
import {
  toHaveTextContent,
  toHaveValue,
  toHaveClass,
} from "@testing-library/jest-dom/matchers";

expect.extend({ toHaveTextContent, toHaveValue, toHaveClass });

it("does input auth works correct", () => {
  const inputValue = "e-mail";
  const inputTitle = "E-mail";
  const inputOnChange = jest.fn();
  const { getByTestId } = render(
    <InputAuth
      value={inputValue}
      title={inputTitle}
      onChange={inputOnChange}
      withOutMargin={true}
    />
  );

  const inputAuth = getByTestId("input-auth");
  const inputAuthContainer = getByTestId("input-auth-container");
  const inputAuthLabel = getByTestId("input-auth-placeholder");

  expect(inputAuthLabel).toHaveTextContent(inputTitle);
  expect(inputAuth).toHaveValue(inputValue);
  expect(inputAuthContainer).toHaveClass("reset-margin");

  const newInputValue = "e-mail2";
  fireEvent.change(inputAuth, {
    target: { value: newInputValue },
  });

  expect(inputOnChange).toHaveBeenCalledWith(newInputValue);
});

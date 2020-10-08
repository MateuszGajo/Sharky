import React from "react";
import { render, fireEvent } from "@testing-library/react";
import {
  toHaveTextContent,
  toHaveValue,
  toHaveClass,
} from "@testing-library/jest-dom/matchers";
import AuthInput from "../AuthInput";

expect.extend({ toHaveTextContent, toHaveValue, toHaveClass });

it("does auth input property works correct", () => {
  const inputValue = "e-mail";
  const titleText = "E-mail";
  const inputOnChange = jest.fn();
  const { getByTestId } = render(
    <AuthInput
      value={inputValue}
      title={titleText}
      onChange={inputOnChange}
      size="large"
    />
  );

  const container = getByTestId("container");
  const field = getByTestId("field");
  const title = getByTestId("title");

  expect(title).toHaveTextContent(titleText);
  expect(field).toHaveValue(inputValue);
  expect(container).toHaveClass("auth-input--large");

  const newInputValue = "e-mail2";
  fireEvent.change(field, {
    target: { value: newInputValue },
  });

  expect(inputOnChange).toHaveBeenCalledWith(newInputValue);
});

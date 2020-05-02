import React from "react";
import { render, fireEvent } from "@testing-library/react";
import {
  toHaveTextContent,
  toHaveValue,
  toHaveClass,
} from "@testing-library/jest-dom/matchers";
import PrimaryInput from "../PrimaryInput";

expect.extend({ toHaveTextContent, toHaveValue, toHaveClass });

it("Does primary input works correct", () => {
  const inputName = "email";
  const inputValue = "dwa";
  const inputTitle = "E-mail";
  const inputOnChange = jest.fn();
  const { getByTestId } = render(
    <PrimaryInput
      name={inputName}
      value={inputValue}
      onChange={inputOnChange}
      title={inputTitle}
      autocompleteData={[]}
      withOutMargin={true}
      size="large"
    />
  );
  const primaryInput = getByTestId("primary-input");
  const primaryInputTitle = getByTestId("primary-input-title");
  const autocomplete = getByTestId("input-primary-autocomplete");
  const primaryInputContainer = getByTestId("primary-input-container");

  expect(primaryInputTitle).toHaveTextContent(inputTitle);
  expect(primaryInput).toHaveValue(inputValue);
  expect(autocomplete).toHaveClass("is-close");
  expect(primaryInputContainer).toHaveClass(
    "reset-margin primary-input-container--large"
  );

  const newInputValue = "A";
  fireEvent.change(primaryInput, {
    target: { value: newInputValue },
  });

  expect(inputOnChange).toHaveBeenCalledWith(newInputValue);
  expect(inputOnChange).toBeCalledTimes(1);
});
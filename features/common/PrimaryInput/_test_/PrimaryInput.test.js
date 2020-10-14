import React from "react";
import { render, fireEvent } from "@testing-library/react";
import {
  toHaveTextContent,
  toHaveValue,
  toHaveClass,
} from "@testing-library/jest-dom/matchers";
import PrimaryInput from "../PrimaryInput";

expect.extend({ toHaveTextContent, toHaveValue, toHaveClass });

it("Does primary input work correct", () => {
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
  const container = getByTestId("container");
  const title = getByTestId("title");
  const autocomplete = getByTestId("autocomplete");
  const field = getByTestId("field");

  expect(title).toHaveTextContent(inputTitle);
  expect(field).toHaveValue(inputValue);
  expect(autocomplete).toHaveClass("is-close");
  expect(container).toHaveClass("reset-margin primary-input--large");

  const newInputValue = "A";
  fireEvent.change(field, {
    target: { value: newInputValue },
  });

  expect(inputOnChange).toHaveBeenCalledWith(newInputValue);
  expect(inputOnChange).toBeCalledTimes(1);
});

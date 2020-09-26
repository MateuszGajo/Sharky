import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { toHaveClass, toHaveValue } from "@testing-library/jest-dom/matchers";
import SecondaryInput from "../SecondaryInput";

expect.extend({ toHaveClass, toHaveValue });

it("Does secondary input displays correct", () => {
  const inputValue = "text";
  const onChange = jest.fn();

  const { getByTestId } = render(
    <SecondaryInput size="large" value={inputValue} onChange={onChange} />
  );

  const inputPhoto = getByTestId("secondary-input-photo");
  const inputField = getByTestId("secondary-input-field");

  expect(inputPhoto).toHaveClass("secondary-input__photo__photo--large");
  expect(inputField).toHaveClass("secondary-input__text__input--large");
  expect(inputField).toHaveValue(inputValue);

  const newInputValue = "text2";
  fireEvent.change(inputField, {
    target: { value: newInputValue },
  });
  expect(onChange).toHaveBeenCalledWith(newInputValue);
});

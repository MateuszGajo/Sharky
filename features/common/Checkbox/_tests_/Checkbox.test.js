import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Checkbox from "../Checkbox";

it("does Checkbox work correct", () => {
  const value = false;
  const onChange = jest.fn();
  const { getByTestId } = render(
    <Checkbox value={value} onChange={onChange} />
  );

  const checkbox = getByTestId("input-checkbox");

  fireEvent.click(checkbox);

  expect(onChange).toHaveBeenCalledWith(true);
});

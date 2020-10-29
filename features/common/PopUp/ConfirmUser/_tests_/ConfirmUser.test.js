import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { toHaveClass } from "@testing-library/jest-dom/matchers";
import ConfirmUser from "../ConfirmUser";

expect.extend({ toHaveClass });

it("does confirm user property work correct", () => {
  const setOpen = jest.fn();
  const { getByTestId } = render(<ConfirmUser setOpen={setOpen} />);

  const confirmUserPopUp = getByTestId("close-icon");
  fireEvent.click(confirmUserPopUp);
  expect(setOpen).toHaveBeenCalledWith(false);
});

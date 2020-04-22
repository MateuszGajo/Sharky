import React from "react";
import { render } from "@testing-library/react";
import { toHaveClass } from "@testing-library/jest-dom/matchers";
import ConfirmUser from "../ConfirmUser";

expect.extend({ toHaveClass });

it("does confirm user property works correct", () => {
  const { getByTestId } = render(<ConfirmUser isOpen={false} />);

  const confirmUserPopUp = getByTestId("confrim-user-container");
  expect(confirmUserPopUp).toHaveClass("is-close");
});

import React from "react";
import { render, fireEvent } from "@testing-library/react";
import SignIn from "../signin";

it("form submit, does input data works correct", () => {
  const onSubmit = jest.fn();
  const { getByTestId } = render(<SignIn onSubmit={onSubmit} />);

  const email = "example@gmail.com";
  const password = "test123";

  fireEvent.change(getByTestId("input-email"), {
    target: { value: email },
  });
  fireEvent.change(getByTestId("input-password"), {
    target: { value: password },
  });

  fireEvent.click(getByTestId("primary-button"));
  expect(onSubmit).toBeCalledWith({
    email,
    password,
  });
});

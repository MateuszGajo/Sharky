import React from "react";
import { render, fireEvent } from "@testing-library/react";
import SignUp from "../signup";

it("submit form, does input data is correct", () => {
  const onSubmit = jest.fn();
  const { getByText, getByTestId } = render(<SignUp onSubmit={onSubmit} />);

  const email = "example@gmail.com";
  const password = "test123";
  const confirmPassword = "test123";
  const firstName = "Shaun";
  const lastName = "Ron";
  const phoneNumber = "123456789";

  fireEvent.change(getByTestId("email-input"), {
    target: { value: email }
  });
  fireEvent.change(getByTestId("password-input"), {
    target: { value: password }
  });
  fireEvent.change(getByTestId("confirmpassword-input"), {
    target: { value: confirmPassword }
  });

  fireEvent.click(getByTestId("form-pagination-right"));

  fireEvent.change(getByTestId("firstname-input"), {
    target: { value: firstName }
  });
  fireEvent.change(getByTestId("lastname-input"), {
    target: { value: lastName }
  });
  fireEvent.change(getByTestId("phonenumber-input"), {
    target: { value: phoneNumber }
  });

  fireEvent.click(getByText(/Zarejstruj/i));
  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(onSubmit).toHaveBeenLastCalledWith({
    email,
    confirmPassword,
    email,
    firstName,
    lastName,
    password,
    phoneNumber
  });
});

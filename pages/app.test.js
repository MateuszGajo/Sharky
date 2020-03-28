import React from "react";
import { render, fireEvent } from "@testing-library/react";
import App from "./App";

test("submits username , password and phonenumber", () => {
  const userName = "test";
  const password = "password";
  const phoneNumber = "121212";
  const onSubmit = jest.fn();

  const { getByText, getByLabelText } = render(<App onSubmit={onSubmit} />);

  fireEvent.change(getByLabelText(/username/i), {
    target: { value: userName }
  });

  fireEvent.change(getByLabelText(/password/i), {
    target: { value: password }
  });

  fireEvent.change(getByLabelText(/phoneNumber/i), {
    target: { value: phoneNumber }
  });

  fireEvent.click(getByText(/log in/i));
  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(onSubmit).toHaveBeenCalledWith({
    username: userName,
    password,
    phonenumber: phoneNumber
  });
});

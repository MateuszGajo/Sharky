import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { toHaveClass, toHaveValue } from "@testing-library/jest-dom/matchers";
import MessageBox from "../MessageBox";

expect.extend({ toHaveClass, toHaveValue });

it("does message box property works correct", () => {
  const messageBoxValue = "message";
  const messageBoxOnChange = jest.fn();

  const { getByTestId } = render(
    <MessageBox
      value={messageBoxValue}
      onChange={messageBoxOnChange}
      btn-size="medium"
      size="large"
    />
  );

  const messageBox = getByTestId("message-box");
  const messageBoxTextarea = getByTestId("message-box-textarea");

  expect(messageBox).toHaveClass("message-box--large");
  expect(messageBoxTextarea).toHaveValue(messageBoxValue);

  const newMessageBoxValue = "messsage2";
  fireEvent.change(messageBoxTextarea, {
    target: { value: newMessageBoxValue },
  });

  expect(messageBoxOnChange).toHaveBeenCalledWith(newMessageBoxValue);
});

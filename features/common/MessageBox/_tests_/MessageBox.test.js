import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { toHaveValue } from "@testing-library/jest-dom/matchers";
import MessageBox from "../MessageBox";

expect.extend({ toHaveValue });

it("does message box property work correct", () => {
  const messageBoxValue = "message";
  const messageBoxOnChange = jest.fn();

  const { getByTestId } = render(
    <MessageBox
      value={messageBoxValue}
      onChange={messageBoxOnChange}
      btn-size="medium"
    />
  );

  const messageBoxTextarea = getByTestId("message-box-textarea");

  expect(messageBoxTextarea).toHaveValue(messageBoxValue);

  const newMessageBoxValue = "messsage2";
  fireEvent.change(messageBoxTextarea, {
    target: { value: newMessageBoxValue },
  });

  expect(messageBoxOnChange).toHaveBeenCalledWith(newMessageBoxValue);
});

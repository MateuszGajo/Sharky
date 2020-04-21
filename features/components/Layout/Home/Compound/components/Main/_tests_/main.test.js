import React from "react";
import { render } from "@testing-library/react";
import { toHaveTextContent } from "@testing-library/jest-dom/matchers";
import Main from "../Main";

expect.extend({ toHaveTextContent });

it("do children exist", () => {
  const { getByTestId } = render(<Main children="text" />);
  const mainChildren = getByTestId("main-content");

  expect(mainChildren).toHaveTextContent("text");
});

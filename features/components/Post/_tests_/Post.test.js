import React from "react";
import { render } from "@testing-library/react";

import Post from "../Post";

expect.extend({ toHaveClass, toHaveTextContent });

it("does post displays correct", () => {
  const { getByTestId, queryByTestId } = render(<Post isComment={false} />);

  const commentsSections = getByTestId("post-comments");

  expect(commentsSections.childElementCount).toBe(0);
});

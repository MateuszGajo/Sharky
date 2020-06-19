import React from "react";
import { render } from "@testing-library/react";
import { toHaveTextContent } from "@testing-library/jest-dom/matchers";
import Content from "../Content";

expect.extend({ toHaveTextContent });

test("does content displays correct", () => {
  const post = {
    id: 1,
    userId: 123,
    content: "content",
    date: new Date("2016-04-25"),
  };
  const { getByTestId, queryByTestId } = render(<Content post={post} />);

  const postContent = getByTestId("post-content");
  const postPhoto = queryByTestId("post-photo");

  expect(postContent).toHaveTextContent(post.content);
  expect(postPhoto).toBeNull();
});

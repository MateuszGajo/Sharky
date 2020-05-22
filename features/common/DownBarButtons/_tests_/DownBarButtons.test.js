import React from "react";
import { render } from "@testing-library/react";
import {
  toHaveClass,
  toHaveTextContent,
} from "@testing-library/jest-dom/matchers";
import DownBarButton from "../DownBarButtons";

expect.extend({ toHaveClass, toHaveTextContent });

it("does downbar-buttons property wroks correct", () => {
  const statisticks = {
    posts: 123,
    comments: 123,
    shares: 24,
  };
  const isLiked = true;

  const { getByTestId } = render(
    <DownBarButton statisticks={statisticks} isLiked={isLiked} />
  );

  const numberOfComments = getByTestId("downbar-buttons-number-of-comments");
  const numberOfPosts = getByTestId("downbar-buttons-number-of-posts");
  const numberOfShares = getByTestId("downbar-buttons-number-of-shares");
  const likeButton = getByTestId("downbar-buttons-heart-icon");

  expect(numberOfComments).toHaveTextContent(statisticks.comments);
  expect(numberOfPosts).toHaveTextContent(statisticks.posts);
  expect(numberOfShares).toHaveTextContent(statisticks.shares);
  expect(likeButton).toHaveClass("pal-color");
});

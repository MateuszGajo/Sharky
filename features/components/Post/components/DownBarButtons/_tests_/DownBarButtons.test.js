import React from "react";
import { render } from "@testing-library/react";
import {
  toHaveClass,
  toHaveTextContent,
} from "@testing-library/jest-dom/matchers";
import DownBarButton from "../DownBarButtons";

expect.extend({ toHaveClass, toHaveTextContent });

it("does post__item__downbar__buttons property wroks correct", () => {
  const statisticks = {
    likes: 123,
    comments: 123,
    shares: 24,
  };
  const isLiked = true;

  const { getByTestId } = render(
    <DownBarButton statisticks={statisticks} isLiked={isLiked} />
  );

  const numberOfComments = getByTestId("downbar-number-of-comments");
  const numberOfLikes = getByTestId("downbar-number-of-likes");
  const numberOfShares = getByTestId("downbar-number-of-shares");
  const likeButton = getByTestId("downbar-heart-icon");

  expect(numberOfComments).toHaveTextContent(statisticks.comments);
  expect(numberOfLikes).toHaveTextContent(statisticks.likes);
  expect(numberOfShares).toHaveTextContent(statisticks.shares);
  expect(likeButton).toHaveClass("pal-color");
});

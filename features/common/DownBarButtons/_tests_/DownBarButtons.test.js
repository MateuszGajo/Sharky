import React from "react";
import { render } from "@testing-library/react";
import {
  toHaveClass,
  toHaveTextContent,
} from "@testing-library/jest-dom/matchers";
import DownBarButton from "../DownBarButtons";

expect.extend({ toHaveClass, toHaveTextContent });

it("does downbar-buttons property wroks correct", () => {
  const amounts = {
    posts: 123,
    comments: 123,
    shares: 24,
  };
  const isLiked = true;

  const { getByTestId } = render(
    <DownBarButton amounts={amounts} isLiked={isLiked} />
  );

  const amountOfComments = getByTestId("downbar-buttons-amount-of-comments");
  const amountOfPosts = getByTestId("downbar-buttons-amount-of-posts");
  const amountOfShares = getByTestId("downbar-buttons-amount-of-shares");
  const likeButton = getByTestId("downbar-buttons-heart-icon");

  expect(amountOfComments).toHaveTextContent(amounts.comments);
  expect(amountOfPosts).toHaveTextContent(amounts.posts);
  expect(amountOfShares).toHaveTextContent(amounts.shares);
  expect(likeButton).toHaveClass("pal-color");
});

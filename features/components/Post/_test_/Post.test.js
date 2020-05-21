import React from "react";
import { render, fireEvent } from "@testing-library/react";
import {
  toHaveClass,
  toHaveTextContent,
} from "@testing-library/jest-dom/matchers";
import Post from "../Post";

expect.extend({ toHaveClass, toHaveTextContent });

it("does post displays correct", () => {
  const post = {
    id: 1,
    userId: 123,
    content: "content",
    date: new Date("2016-04-25"),
  };

  const user = {
    id: 123,
    firstName: "Janek",
    lastName: "Kowalski",
    photo: "profile.png",
  };

  const { getByTestId, queryByTestId } = render(
    <Post singlePost={false} post={post} user={user} />
  );

  const dtf = new Intl.DateTimeFormat("pl", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  const [{ value: da }, , { value: mo }, , { value: ye }] = dtf.formatToParts(
    post.date
  );

  const commentsSections = getByTestId("post-comments");
  const authorPost = getByTestId("post-username");
  const postDate = getByTestId("post-date");
  const postContent = getByTestId("post-content");
  const postPhoto = queryByTestId("post-photo");

  const postSettingIcon = getByTestId("post-setting-icon");
  const postSetting = getByTestId("post-setting");

  expect(commentsSections.childElementCount).toBe(0);
  expect(authorPost).toHaveTextContent(`${user.firstName} ${user.lastName}`);
  expect(postDate).toHaveTextContent(`${da} ${mo} ${ye}`);
  expect(postContent).toHaveTextContent(post.content);
  expect(postPhoto).toBeNull();

  fireEvent.click(postSettingIcon);
  expect(postSetting).not.toHaveClass("is-close");

  fireEvent.click(postSettingIcon);
  expect(postSetting).toHaveClass("is-close");
});

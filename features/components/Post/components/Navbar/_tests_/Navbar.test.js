import React from "react";
import { render, fireEvent } from "@testing-library/react";
import {
  toHaveClass,
  toHaveTextContent,
} from "@testing-library/jest-dom/matchers";
import Navbar from "../Navbar";

expect.extend({ toHaveClass, toHaveTextContent });

test("does navbar displays correct", () => {
  const date = new Date("2016-04-25");

  const user = {
    id: 123,
    firstName: "Janek",
    lastName: "Kowalski",
    photo: "profile.png",
  };

  const { getByTestId } = render(
    <Navbar date={date} user={user} focusElement={null} />
  );

  const dtf = new Intl.DateTimeFormat("pl", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  const [{ value: da }, , { value: mo }, , { value: ye }] = dtf.formatToParts(
    date
  );

  const authorPost = getByTestId("post-username");
  const postDate = getByTestId("post-date");

  const postSettingIcon = getByTestId("post-setting-icon");
  const postSetting = getByTestId("post-setting");

  expect(authorPost).toHaveTextContent(`${user.firstName} ${user.lastName}`);
  expect(postDate).toHaveTextContent(`${da} ${mo} ${ye}`);

  fireEvent.click(postSettingIcon);
  expect(postSetting).not.toHaveClass("is-close");

  fireEvent.click(postSettingIcon);
  expect(postSetting).toHaveClass("is-close");
});

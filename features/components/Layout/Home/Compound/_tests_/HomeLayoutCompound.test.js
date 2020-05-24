import React from "react";
import { render, fireEvent } from "@testing-library/react";
import * as HomeLayoutCompound from "../HomeLayoutCompound";
import { WizzardContext } from "../context/WizzardContext";

<<<<<<< HEAD
=======
<<<<<<< HEAD
it("is post content and search content correct", () => {
  const onsubmit = jest.fn();
  const searchContent = "something";
  const postContent = "something";
  const mockContext = {
    postContent: "",
    setPostContent: jest.fn(),
    searchContent: "",
    setSearchContent: jest.fn(),
  };

  const { getByTestId, getByText } = render(
    <WizzardContext.Provider value={mockContext}>
      <HomeLayoutCompound.Main
        onSubmit={onsubmit}
        search={true}
        addingPost={true}
      />
    </WizzardContext.Provider>
  );

  fireEvent.change(getByTestId("post-text-area"), {
    target: { value: postContent },
  });
  fireEvent.click(getByText(/Opublikuj/i));

  fireEvent.change(getByTestId("search-input"), {
    target: { value: searchContent },
  });
  fireEvent.click(getByTestId("search-button"));

  expect(mockContext.setPostContent).toBeCalledWith(postContent);
  expect(mockContext.setSearchContent).toBeCalledWith(searchContent);
});

it("is the massanger show", () => {
  const mockContext = {
    isMessage: false,
    setStatusOfMessage: jest.fn(),
=======
>>>>>>> features/settings
it("does messanger shows", () => {
  const mockContext = {
    isMessengerClose: true,
    setStatusOfMessenger: jest.fn(),
<<<<<<< HEAD
=======
>>>>>>> common-layout
>>>>>>> features/settings
  };
  const { getByTestId } = render(
    <WizzardContext.Provider value={mockContext}>
      <HomeLayoutCompound.FriendsBar />
    </WizzardContext.Provider>
  );

<<<<<<< HEAD
  fireEvent.click(getByTestId("friend0"));

  expect(mockContext.setStatusOfMessenger).toBeCalledWith(false);
=======
<<<<<<< HEAD
  fireEvent.click(getByTestId("friend1"));

  expect(mockContext.setStatusOfMessage).toBeCalledWith(true);
=======
  fireEvent.click(getByTestId("friend0"));

  expect(mockContext.setStatusOfMessenger).toBeCalledWith(false);
>>>>>>> common-layout
>>>>>>> features/settings
});

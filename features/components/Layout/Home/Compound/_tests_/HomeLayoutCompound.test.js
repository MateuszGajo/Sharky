import React from "react";
import { render, fireEvent } from "@testing-library/react";
import * as HomeLayoutCompound from "../HomeLayoutCompound";
import { WizzardContext } from "../context/WizzardContext";

it("does messanger shows", () => {
  const mockContext = {
    isMessengerClose: true,
    setStatusOfMessenger: jest.fn(),
  };
  const { getByTestId } = render(
    <WizzardContext.Provider value={mockContext}>
      <HomeLayoutCompound.FriendsBar />
    </WizzardContext.Provider>
  );

  fireEvent.click(getByTestId("friend0"));

  expect(mockContext.setStatusOfMessenger).toBeCalledWith(false);
});

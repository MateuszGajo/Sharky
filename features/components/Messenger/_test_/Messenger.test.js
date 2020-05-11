import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { toHaveClass } from "@testing-library/jest-dom/matchers";
import Messenger from "../Messenger";

expect.extend({ toHaveClass });

it("does messenger displays correct", () => {
  const messengerStatus = jest.fn();
  const onSubmit = jest.fn();

  const user = {
    id: 123,
  };

  const users = {
    123: {
      id: 123,
      firstName: "Jan",
      lastName: "Kowalski",
      photo: "profile.png",
    },
  };

  const conversation = {
    id: 1212,
    type: "group",
    name: "Grupowa konwersacja",
    photo: "group",
    members: [123, 124, 125],
    messages: [
      {
        idUser: 123,
        message: "Lorem",
        date: new Date(),
      },
    ],
  };
  const { getByTestId } = render(
    <Messenger
      isMessengerClose={true}
      windowMessenger={true}
      setStatusOfMessenger={messengerStatus}
      onSubmit={onSubmit}
      user={user}
      users={users}
      conversation={conversation}
    />
  );

  const messengerBox = getByTestId("messenger");
  const messengerClose = getByTestId("messenger-close");
  const messengerTextField = getByTestId("messenger-text");
  const messengerSendButton = getByTestId("messenger-send-button");
  const messengerChat = getByTestId("messenger-chat");
  const message = "message";

  fireEvent.click(messengerClose);
  fireEvent.change(messengerTextField, {
    target: { value: message },
  });
  fireEvent.click(messengerSendButton);

  expect(messengerStatus).toHaveBeenCalledWith(true);
  expect(onSubmit).toHaveBeenCalledWith(message);
  expect(messengerBox).toHaveClass("window-messanger is-close");
  expect(messengerChat.childElementCount).toBe(1);
  expect(messengerChat.firstChild).toHaveClass("messenger__text--myself");
});

import React from "react";
import { render, fireEvent } from "@testing-library/react";
import {
  toHaveTextContent,
  toHaveClass,
} from "@testing-library/jest-dom/matchers";
import Card from "../Card";

expect.extend({ toHaveTextContent, toHaveClass });

it("does card displays correct", () => {
  const data = {
    refType: "profile",
    refId: 123,
    photo: "profile.png",
    radiusPhoto: true,
    name: "Janek Kowalski",
    description: "Coś tam",
    button: "join",
    title: "Przyjaciel",
    collapse: false,
    collapseItems: {
      pink: "Przyjaciel",
      blue: "Rodzina",
      green: "Znajomy",
    },
  };

  const { getByTestId, queryByTestId } = render(<Card data={data} />);

  const cardPhoto = getByTestId("card-photo");
  const cardName = getByTestId("card-name");
  const cardDescription = getByTestId("card-description");
  const cardButton = getByTestId("card-button");
  const cardButtonText = getByTestId("card-button-text");
  const cardButtons = getByTestId("card-buttons");
  const cardUpdateButton = queryByTestId("card-update-button");

  expect(cardPhoto).toHaveClass("card__item--picture--img--radius");
  expect(cardName).toHaveTextContent(data.name);
  expect(cardDescription).toHaveTextContent(data.description);
  expect(cardButton).toHaveClass(
    "card__item__info__second-column__buttons--join pal-background"
  );
  expect(cardButtonText).toHaveTextContent(data.title);
  expect(cardUpdateButton).toBeNull();
});

it("do relation buttons work correct", () => {
  const data = {
    refType: "profile",
    refId: 123,
    photo: "profile.png",
    radiusPhoto: true,
    name: "Janek Kowalski",
    description: "Coś tam",
    button: "join",
    title: "Przyjaciel",
    collapse: true,
    collapseItems: {
      pink: "Przyjaciel",
      blue: "Rodzina",
      green: "Znajomy",
    },
  };

  const updateRelation = jest.fn();

  const { getByTestId } = render(
    <Card data={data} updateRelation={updateRelation} />
  );

  const cardRelationButtonGreen = getByTestId("card-relation-button-green");

  fireEvent.click(cardRelationButtonGreen);

  expect(updateRelation).toHaveBeenCalledWith({
    id: data.refId,
    name: data.collapseItems.green,
  });
});

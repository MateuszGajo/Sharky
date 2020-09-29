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
    relationId: null,
    photo: "profile.png",
    radiusPhoto: true,
    name: "Janek Kowalski",
    description: "Coś tam",
    button: "join",
    buttonName: "przyjaciel",
    title: "title",
    collapse: false,
    collapseItems: {
      pink: {
        name: "przyjaciel",
        title: "przyjaciel",
      },
      blue: {
        name: "rodzina",
        title: "rodzina",
      },
      green: {
        name: "znajomy",
        title: "znajomy",
      },
    },
  };
  const { getByTestId, queryByTestId } = render(<Card data={data} />);

  const cardPhoto = getByTestId("card-photo");
  const cardName = getByTestId("card-name");
  const cardDescription = getByTestId("card-description");
  const cardButton = getByTestId("card-button");
  const cardButtonText = getByTestId("card-button-text");
  const cardUpdateButton = queryByTestId("card-update-button");

  expect(cardPhoto).toHaveClass("card__item__photo__img--radius");
  expect(cardName).toHaveTextContent(data.name);
  expect(cardDescription).toHaveTextContent(data.description);
  expect(cardButton).toHaveClass(
    "card__item__info__second-column__buttons__main-button pal-background"
  );
  expect(cardButtonText).toHaveTextContent(data.title);
  expect(cardUpdateButton).toBeNull();
});

it("do relation buttons work correct", () => {
  const data = {
    refType: "profile",
    refId: 123,
    relationId: null,
    photo: "profile.png",
    radiusPhoto: true,
    name: "Janek Kowalski",
    description: "Coś tam",
    button: "join",
    buttonName: "przyjaciel",
    title: "title",
    collapse: true,
    collapseItems: {
      pink: {
        name: "przyjaciel",
        title: "przyjaciel",
      },
      blue: {
        name: "rodzina",
        title: "rodzina",
      },
      green: {
        name: "znajomy",
        title: "znajomy",
      },
    },
  };

  const updateRelation = jest.fn();

  const { getByTestId } = render(
    <Card data={data} setRelation={updateRelation} />
  );

  const cardRelationButtonGreen = getByTestId("card-relation-button-green");

  fireEvent.click(cardRelationButtonGreen);

  expect(updateRelation).toHaveBeenCalledWith({
    id: null,
    name: data.collapseItems.green.name,
  });
});

import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { toHaveClass, toHaveValue } from "@testing-library/jest-dom/matchers";
import Search from "../Search";

expect.extend({ toHaveClass, toHaveValue });

it("does search property work correct", () => {
  const searchValue = "search";
  const searchOnChange = jest.fn();
  const { getByTestId } = render(
    <Search size="x-large" value={searchValue} onChange={searchOnChange} />
  );

  const searchInput = getByTestId("search-input");
  const searchContainer = getByTestId("search");

  expect(searchContainer).toHaveClass("search--x-large");
  expect(searchInput).toHaveValue(searchValue);

  const newSearchValue = "searching";
  fireEvent.change(searchInput, {
    target: { value: newSearchValue },
  });

  expect(searchOnChange).toHaveBeenCalledWith(newSearchValue);
});

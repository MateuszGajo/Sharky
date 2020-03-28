import React from "react";
import { render, fireEvent } from "@testing-library/react";
import * as MultiStepForm from "../MultiStepForm";
import { WizzardContext } from "../context/WizzardContext";

it("does auth pagination buttons work correctly", () => {
  const mockedContext = {
    page: 2,
    setPage: jest.fn(),
    numberOfPages: 3
  };
  const { getByTestId } = render(
    <WizzardContext.Provider value={mockedContext}>
      <MultiStepForm.Controls />
    </WizzardContext.Provider>
  );

  fireEvent.click(getByTestId("form-pagination-left"));
  expect(mockedContext.setPage).toBeCalledWith(1);
  expect(mockedContext.setPage).toBeCalledTimes(1);

  fireEvent.click(getByTestId("form-pagination-right"));
  expect(mockedContext.setPage).toBeCalledWith(3);
  expect(mockedContext.setPage).toBeCalledTimes(2);
});

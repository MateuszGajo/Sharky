import React from "react";
import { render } from "@testing-library/react";
import Authentication from "../Authentication";

it("signin, does text changed on the auth form", () => {
  const { getByTestId } = render(<Authentication type="signin" />);
  expect(getByTestId("welcome-text").textContent).toEqual(
    "Wypełnij formularz i dołącz do naszej społecznośći"
  );
  expect(getByTestId("redirect-auth-button").textContent).toEqual("Rejstracja");
  expect(getByTestId("title-auth").textContent).toEqual("Zaloguj się");
});
it("signup, does text changed on the auth form", () => {
  const { getByTestId } = render(<Authentication type="signup" />);
  expect(getByTestId("welcome-text").textContent).toEqual(
    "Jeżeli posiadasz już konto"
  );
  expect(getByTestId("redirect-auth-button").textContent).toEqual(
    "Zaloguj się"
  );
  expect(getByTestId("title-auth").textContent).toEqual("Wypełnij formularz");
});

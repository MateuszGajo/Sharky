import React from "react";
import { render } from "@testing-library/react";
import Authentication from "../Authentication";
import { toHaveTextContent } from "@testing-library/jest-dom/matchers";

expect.extend({ toHaveTextContent });

describe("is text changing on auth form", () => {
  it("signin", () => {
    const { getByTestId } = render(<Authentication type="signin" />);

    expect(getByTestId("welcome-text")).toHaveTextContent(
      "Wypełnij formularz i dołącz do naszej społecznośći"
    );

    expect(getByTestId("redirect-auth-button")).toHaveTextContent("Rejstracja");
    expect(getByTestId("title-auth")).toHaveTextContent("Zaloguj się");
  });
  it("signup", () => {
    const { getByTestId } = render(<Authentication type="signup" />);
    expect(getByTestId("welcome-text")).toHaveTextContent(
      "Jeżeli posiadasz już konto"
    );
    expect(getByTestId("redirect-auth-button")).toHaveTextContent(
      "Zaloguj się"
    );
    expect(getByTestId("title-auth")).toHaveTextContent("Wypełnij formularz");
  });
});

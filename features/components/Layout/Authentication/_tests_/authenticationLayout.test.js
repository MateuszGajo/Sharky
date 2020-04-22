import React from "react";
import { render } from "@testing-library/react";
import Authentication from "../Authentication";
import { toHaveTextContent } from "@testing-library/jest-dom/matchers";

expect.extend({ toHaveTextContent });

describe("is auth form text changing", () => {
  it("signin", () => {
    const { getByTestId } = render(<Authentication type="signin" />);

    const welcomeText = getByTestId("welcome-text");
    const primaryButton = getByTestId("primary-button");
    const sectionName = getByTestId("title-auth");
    expect(welcomeText).toHaveTextContent(
      "Wypełnij formularz i dołącz do naszej społecznośći"
    );
    expect(primaryButton).toHaveTextContent("Rejstracja");
    expect(sectionName).toHaveTextContent("Zaloguj się");
  });

  it("signup", () => {
    const { getByTestId } = render(<Authentication type="signup" />);
    const welcomeText = getByTestId("welcome-text");
    const primaryButton = getByTestId("primary-button");
    const sectionName = getByTestId("title-auth");

    expect(welcomeText).toHaveTextContent("Jeżeli posiadasz już konto");
    expect(primaryButton).toHaveTextContent("Zaloguj się");
    expect(sectionName).toHaveTextContent("Wypełnij formularz");
  });
});

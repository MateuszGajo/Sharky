import React from "react";
import { render } from "@testing-library/react";
import { toHaveTextContent } from "@testing-library/jest-dom/matchers";
import Authentication from "../Authentication";

expect.extend({ toHaveTextContent });

describe("is auth form text changing", () => {
  it("signin", () => {
    const { getByTestId } = render(<Authentication type="signin" />);

    const welcomeText = getByTestId("welcome-text");
    const primaryButton = getByTestId("primary-button");
    const sectionName = getByTestId("title-auth");
    expect(welcomeText).toHaveTextContent(
      "component:layout.authentication.sign-in.description"
    );
    expect(primaryButton).toHaveTextContent(
      "component:layout.authentication.sign-in.button"
    );
    expect(sectionName).toHaveTextContent(
      "component:layout.authentication.sign-in.title"
    );
  });

  it("signup", () => {
    const { getByTestId } = render(<Authentication type="signup" />);
    const welcomeText = getByTestId("welcome-text");
    const primaryButton = getByTestId("primary-button");
    const sectionName = getByTestId("title-auth");

    expect(welcomeText).toHaveTextContent(
      "component:layout.authentication.sign-up.description"
    );
    expect(primaryButton).toHaveTextContent(
      "component:layout.authentication.sign-up.button"
    );
    expect(sectionName).toHaveTextContent(
      "component:layout.authentication.sign-up.title"
    );
  });
});

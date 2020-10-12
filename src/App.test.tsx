import React from "react";
import { render, cleanup } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import App from "./App";

expect.extend(toHaveNoViolations);

afterEach(cleanup);

describe("App component", () => {
  test("renders the component", () => {
    const { container } = render(<App />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("has no axe violations", async () => {
    const { container } = render(<App />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

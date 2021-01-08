import React from "react";
import { cleanup, render } from "@testing-library/react";
import { axe } from "jest-axe";
import Welcome from "./Welcome";

afterEach(cleanup);

describe("Welcome page", () => {
  it("renders the component", () => {
    const { container } = render(<Welcome />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Welcome />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

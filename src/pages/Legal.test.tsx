import React from "react";
import { cleanup, render } from "@testing-library/react";
import { axe } from "jest-axe";
import Legal from "./Legal";

afterEach(cleanup);

describe("Legal page", () => {
  it("renders the component", () => {
    const { container } = render(<Legal />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Legal />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

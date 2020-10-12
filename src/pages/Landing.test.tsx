import React from "react";
import { cleanup, render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import Landing from "./Landing";

expect.extend(toHaveNoViolations);

afterEach(cleanup);

describe("Landing page", () => {
  it("renders the component", () => {
    const { container } = render(<Landing />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Landing />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

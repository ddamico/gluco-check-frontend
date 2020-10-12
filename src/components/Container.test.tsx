import React from "react";
import { cleanup, render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import Container from "./Container";

expect.extend(toHaveNoViolations);

afterEach(cleanup);

describe("Container component", () => {
  it("renders the component", () => {
    const { container } = render(<Container>test</Container>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Container>test</Container>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

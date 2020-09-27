import React from "react";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import App from "./App";

expect.extend(toHaveNoViolations);

test("renders the component", () => {
  const { container } = render(<App />);
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="App"
    >
      Hey
    </div>
  `);
});

test("has no axe violations", async () => {
  const { container } = render(<App />);
  const axeResults = await axe(container);
  expect(axeResults).toHaveNoViolations();
});

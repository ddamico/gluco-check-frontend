import React from "react";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import App from "./App";

expect.extend(toHaveNoViolations);

test("renders the component", () => {
  const { container } = render(<App />);
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div>
      <ul>
        <li>
          <a
            href="/"
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="/login"
          >
            Login
          </a>
        </li>
      </ul>
      <hr />
    </div>
  `);
});

test("has no axe violations", async () => {
  const { container } = render(<App />);
  expect(await axe(container)).toHaveNoViolations();
});

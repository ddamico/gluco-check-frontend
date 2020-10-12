import React from "react";
import { render, cleanup } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import * as firebaseAuthHooks from "react-firebase-hooks/auth";
import App from "./App";
import { mockUser } from "./lib/__mocks__/firebase"

expect.extend(toHaveNoViolations);

afterEach(cleanup);

describe("App component", () => {
  test("renders the component when user loading", () => {
    // @ts-ignore
    firebaseAuthHooks.useAuthState = jest.fn().mockReturnValue([undefined, true]);
    const { container } = render(<App />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("renders the component when user loaded", () => {
    // @ts-ignore
    firebaseAuthHooks.useAuthState = jest.fn().mockReturnValue([mockUser, false]);
    const { container } = render(<App />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("has no axe violations", async () => {
    const { container } = render(<App />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

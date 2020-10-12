import React from "react";
import { render, cleanup } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { auth } from "./lib/firebase";
import * as firebaseAuthHooks from "react-firebase-hooks/auth";
import App from "./App";
import { mockUser } from "./lib/__mocks__/firebase"

jest.mock("./lib/firebase.ts", () => {
  return {
    auth: jest.fn().mockReturnThis(),
  };
});

jest.mock("./pages/EditSettings.tsx", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>EditSettings</div>;
    },
  };
});

jest.mock("./pages/Login.tsx", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>Login</div>;
    },
  };
});

expect.extend(toHaveNoViolations);

afterEach(cleanup);

describe("App component", () => {
  it("renders the component when user loading", () => {
    // @ts-ignore
    firebaseAuthHooks.useAuthState = jest.fn().mockReturnValue([undefined, true]);
    const { container } = render(<App />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders the component when user loaded", () => {
    // @ts-ignore
    firebaseAuthHooks.useAuthState = jest.fn().mockReturnValue([mockUser, false]);
    const { container } = render(<App />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("has no axe violations", async () => {
    // @ts-ignore
    firebaseAuthHooks.useAuthState = jest.fn().mockReturnValue([mockUser, false]);
    const { container } = render(<App />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

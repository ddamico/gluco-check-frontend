import React from "react";
import { cleanup, render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import Login from "./Login";

expect.extend(toHaveNoViolations);

jest.mock("../lib/firebase");
jest.mock("react-firebaseui/StyledFirebaseAuth", () => {
  return {
    __esModule: true,
    default: () => {
      return <>This is where the login would be</>;
    },
  };
});

afterEach(cleanup);

describe("Login page", () => {
  it("renders the component", () => {
    const { container } = render(<Login />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Login />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

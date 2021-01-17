import React from "react";
import { cleanup, render } from "@testing-library/react";
import { axe } from "jest-axe";
import Landing from "./Landing";

jest.mock("../lib/firebase");
jest.mock("react-firebaseui/StyledFirebaseAuth", () => {
  return {
    __esModule: true,
    default: () => {
      return <>This is where the login would be</>;
    },
  };
});

jest.mock("../components/Onboarding", () => {
  return {
    __esModule: true,
    default: () => {
      return <>Onboarding</>;
    },
  };
});

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
